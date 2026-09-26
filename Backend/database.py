import sqlite3
import json
import os
import io
import csv
from datetime import datetime
from typing import List, Optional, Tuple, Dict, Any

DB_PATH = os.path.join(os.path.dirname(__file__), "verifai_offline.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Digital Trail Logs
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS digital_trail_logs (
            id TEXT PRIMARY KEY,
            timestamp TEXT NOT NULL,
            document_type TEXT NOT NULL,
            passenger_name TEXT NOT NULL,
            document_number TEXT NOT NULL,
            risk_score REAL NOT NULL,
            verdict TEXT NOT NULL,
            module_alerts TEXT NOT NULL,
            inspection_notes TEXT,
            raw_data TEXT
        )
    """)

    # 2. Blacklist / Watchlist
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS blacklist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            document_number TEXT UNIQUE NOT NULL,
            reason TEXT NOT NULL,
            added_date TEXT NOT NULL
        )
    """)

    # 3. Identity Registry (Face Embeddings)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS identity_registry (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            passenger_name TEXT NOT NULL,
            document_number TEXT NOT NULL,
            embedding TEXT NOT NULL,
            registered_at TEXT NOT NULL
        )
    """)

    # Seed Blacklist if empty
    cursor.execute("SELECT COUNT(*) FROM blacklist")
    if cursor.fetchone()[0] == 0:
        seeded_blacklist = [
            ("A81920391", "FLAG: Document serial matches known stolen blank passport series VAL-2023-B."),
            ("VAL-2023-B", "Stolen blank passport inventory series."),
            ("STOLEN-999", "Reported stolen in Interpol database."),
            ("X99887766", "Revoked visa credential."),
            ("P12345678", "Flagged for international human trafficking syndicate link."),
            ("V-90281944_STOLEN", "Stolen Schengen visa foil number."),
            ("X11223344", "Counterfeit document serial."),
            ("P88776655", "Fraudulent identity document reported by EUROPOL."),
            ("D99881122", "Forged driving permit number."),
            ("P44556677", "Stolen passport batch 2024-DEL.")
        ]
        now = datetime.now().isoformat()
        cursor.executemany(
            "INSERT INTO blacklist (document_number, reason, added_date) VALUES (?, ?, ?)",
            [(doc, reason, now) for doc, reason in seeded_blacklist]
        )

    # Seed Identity Registry with an alias for testing (Victor Belov face) if empty
    cursor.execute("SELECT COUNT(*) FROM identity_registry")
    if cursor.fetchone()[0] == 0:
        # Dummy 128-d embedding for Victor Belov
        dummy_embedding = [0.01 * (i % 5) for i in range(128)]
        cursor.execute(
            "INSERT INTO identity_registry (passenger_name, document_number, embedding, registered_at) VALUES (?, ?, ?, ?)",
            ("Victor Belov", "ALIAS-90128", json.dumps(dummy_embedding), datetime.now().isoformat())
        )

    conn.commit()
    conn.close()

def add_log(
    log_id: str,
    timestamp: str,
    document_type: str,
    passenger_name: str,
    document_number: str,
    risk_score: float,
    verdict: str,
    module_alerts: List[str],
    inspection_notes: Optional[str] = None,
    raw_data: Optional[Dict[str, Any]] = None
):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT OR REPLACE INTO digital_trail_logs 
        (id, timestamp, document_type, passenger_name, document_number, risk_score, verdict, module_alerts, inspection_notes, raw_data)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        log_id,
        timestamp,
        document_type,
        passenger_name,
        document_number,
        risk_score,
        verdict,
        json.dumps(module_alerts),
        inspection_notes or "",
        json.dumps(raw_data) if raw_data else "{}"
    ))
    conn.commit()
    conn.close()

def get_logs() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM digital_trail_logs ORDER BY timestamp DESC")
    rows = cursor.fetchall()
    conn.close()

    logs = []
    for row in rows:
        logs.append({
            "id": row["id"],
            "timestamp": row["timestamp"],
            "documentType": row["document_type"],
            "passengerName": row["passenger_name"],
            "documentNumber": row["document_number"],
            "riskScore": row["risk_score"],
            "verdict": row["verdict"],
            "moduleAlerts": json.loads(row["module_alerts"]),
            "inspectionNotes": row["inspection_notes"]
        })
    return logs

def export_logs_csv() -> str:
    logs = get_logs()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Timestamp", "Document Type", "Passenger Name", "Document Number", "Risk Score", "Verdict", "Alerts", "Notes"])
    for l in logs:
        writer.writerow([
            l["id"],
            l["timestamp"],
            l["documentType"],
            l["passengerName"],
            l["documentNumber"],
            l["riskScore"],
            l["verdict"],
            "; ".join(l["moduleAlerts"]),
            l["inspectionNotes"]
        ])
    return output.getvalue()

def is_blacklisted(doc_number: str) -> Tuple[bool, Optional[str]]:
    if not doc_number or doc_number == "UNKNOWN":
        return False, None
    conn = get_connection()
    cursor = conn.cursor()
    clean_doc = doc_number.strip().upper()
    cursor.execute("SELECT reason FROM blacklist WHERE UPPER(document_number) = ?", (clean_doc,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return True, row["reason"]
    return False, None

def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0
    dot = sum(a * b for a, b in zip(v1, v2))
    norm1 = sum(a * a for a in v1) ** 0.5
    norm2 = sum(b * b for b in v2) ** 0.5
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return dot / (norm1 * norm2)

def check_duplicate_face(
    embedding: List[float],
    current_name: str,
    current_doc: str,
    threshold: float = 0.75
) -> Tuple[bool, Optional[str]]:
    if not embedding:
        return False, None
    
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT passenger_name, document_number, embedding FROM identity_registry")
    rows = cursor.fetchall()
    conn.close()

    for row in rows:
        reg_name = row["passenger_name"]
        reg_doc = row["document_number"]
        reg_emb = json.loads(row["embedding"])
        
        sim = cosine_similarity(embedding, reg_emb)
        # If face is very similar (> threshold) but registered under a different name or document
        if sim > threshold and (reg_name.lower() != current_name.lower() or reg_doc.upper() != current_doc.upper()):
            return True, f"MULTIPLE IDENTITY ALERT: Face matched registered traveler '{reg_name}' (Doc: {reg_doc}) with {sim*100:.1f}% similarity."

    return False, None

def register_face(passenger_name: str, document_number: str, embedding: List[float]):
    if not embedding:
        return
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO identity_registry (passenger_name, document_number, embedding, registered_at) VALUES (?, ?, ?, ?)",
        (passenger_name, document_number, json.dumps(embedding), datetime.now().isoformat())
    )
    conn.commit()
    conn.close()
