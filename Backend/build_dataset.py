import os
import sys
import json
import csv
import random
import urllib.request
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import io
from datetime import datetime, timedelta
from typing import Tuple, List, Dict, Any
from faker import Faker

fake = Faker('en_IN')

# Target directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
TEAM_FACES_DIR = os.path.join(DATA_DIR, "team_faces")
DATASET_DIR = os.path.join(BASE_DIR, "dataset")

FOLDERS = [
    "0_team_live_demo",
    "1_authentic_passports",
    "2_fake_mrz_and_expired",
    "3_fake_tampered_ela",
    "4_fake_face_mismatch"
]

def ensure_directories():
    os.makedirs(TEAM_FACES_DIR, exist_ok=True)
    for folder in FOLDERS:
        os.makedirs(os.path.join(DATASET_DIR, folder), exist_ok=True)

# -------------------------------------------------------------
# ICAO 9303 7-3-1 MATHEMATICAL ENGINE
# -------------------------------------------------------------
def calculate_icao_check_digit(data_str: str) -> str:
    weights = [7, 3, 1]
    total = 0
    for i, char in enumerate(data_str.upper()):
        if '0' <= char <= '9':
            val = int(char)
        elif 'A' <= char <= 'Z':
            val = ord(char) - 55
        elif char == '<':
            val = 0
        else:
            val = 0
        total += val * weights[i % 3]
    return str(total % 10)

def generate_icao_td3_mrz(
    surname: str,
    given_name: str,
    passport_no: str,
    nationality: str,
    dob_yymmdd: str,
    sex: str,
    expiry_yymmdd: str,
    corrupt_check_digit: bool = False
) -> Tuple[str, str]:
    # Line 1 (44 chars): P<IND<SURNAME<<GIVEN<NAME...
    clean_surname = re_clean(surname)
    clean_given = re_clean(given_name)
    line1 = f"P<{nationality[:3].upper()}{clean_surname}<<{clean_given}"
    line1 = (line1[:44]).ljust(44, '<')

    # Line 2 (44 chars)
    clean_pass = passport_no[:9].ljust(9, '<')
    pass_chk = calculate_icao_check_digit(clean_pass)

    nat_code = nationality[:3].upper()

    clean_dob = dob_yymmdd[:6]
    dob_chk = calculate_icao_check_digit(clean_dob)

    clean_sex = sex[0].upper() if sex else 'M'

    clean_exp = expiry_yymmdd[:6]
    exp_chk = calculate_icao_check_digit(clean_exp)

    if corrupt_check_digit:
        dob_chk = str((int(dob_chk) + 5) % 10)

    personal_no = "<" * 14
    personal_chk = "0"

    # Composite check digit
    composite_source = clean_pass + pass_chk + clean_dob + dob_chk + clean_exp + exp_chk + personal_no + personal_chk
    composite_chk = calculate_icao_check_digit(composite_source)

    line2 = f"{clean_pass}{pass_chk}{nat_code}{clean_dob}{dob_chk}{clean_sex}{clean_exp}{exp_chk}{personal_no}{personal_chk}{composite_chk}"
    line2 = line2[:44].ljust(44, '<')

    return line1, line2

def re_clean(text: str) -> str:
    return "".join([c.upper() for c in text if c.isalnum()]).replace(' ', '')

# -------------------------------------------------------------
# PORTRAIT NORMALIZATION (Challenge 1)
# -------------------------------------------------------------
def normalize_portrait(pil_img: Image.Image) -> Image.Image:
    """Center-crop and resize to (230, 290) via LANCZOS, apply Gaussian norm, compress at quality 85"""
    w, h = pil_img.size
    min_dim = min(w, h)
    left = (w - min_dim) // 2
    top = (h - min_dim) // 2
    crop = pil_img.crop((left, top, left + min_dim, top + min_dim))
    resized = crop.resize((230, 290), Image.Resampling.LANCZOS)
    
    # In-memory JPEG buffer quality 85
    buf = io.BytesIO()
    resized.save(buf, format='JPEG', quality=85)
    buf.seek(0)
    return Image.open(buf)

# -------------------------------------------------------------
# PROCEDURAL FACE & STAMP GENERATORS
# -------------------------------------------------------------
def generate_procedural_face(seed: int) -> Image.Image:
    np.random.seed(seed)
    img = np.zeros((300, 300, 3), dtype=np.uint8)
    img[:] = (230, 210, 200) # skin color
    
    # Draw simple facial feature shapes
    cv2.circle(img, (150, 140), 90, (180, 140, 120), -1)
    cv2.circle(img, (115, 125), 15, (255, 255, 255), -1)
    cv2.circle(img, (185, 125), 15, (255, 255, 255), -1)
    cv2.circle(img, (115, 125), 6, (40, 30, 20), -1)
    cv2.circle(img, (185, 125), 6, (40, 30, 20), -1)
    cv2.ellipse(img, (150, 175), (10, 20), 0, 0, 360, (150, 90, 80), 2)
    cv2.ellipse(img, (150, 210), (35, 15), 0, 0, 180, (160, 40, 40), 4)

    return Image.fromarray(img)

def draw_guilloche_background(draw: ImageDraw.ImageDraw, width: int, height: int):
    for y in range(0, height, 15):
        points = []
        for x in range(0, width, 10):
            cy = y + int(12 * np.sin(x / 25.0))
            points.append((x, cy))
        if len(points) > 1:
            draw.line(points, fill=(210, 225, 240), width=1)

def draw_visa_stamp(img: Image.Image, text: str = "CLEARED ENTRY") -> Image.Image:
    overlay = Image.new("RGBA", img.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(overlay)
    
    # Red stamp in top-right region
    x, y, r = 700, 180, 60
    draw.ellipse((x-r, y-r, x+r, y+r), outline=(220, 30, 30, 220), width=4)
    draw.ellipse((x-r+6, y-r+6, x+r-6, y+r-6), outline=(220, 30, 30, 180), width=2)
    draw.text((x-40, y-10), text, fill=(220, 30, 30, 230))
    
    return Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")

# -------------------------------------------------------------
# SYNTHETIC PASSPORT CARD RENDERER (1000x650 px)
# -------------------------------------------------------------
def render_passport_card(
    face_img: Image.Image,
    surname: str,
    given_name: str,
    passport_no: str,
    nationality: str,
    dob_printed: str,
    sex: str,
    expiry_printed: str,
    mrz_line1: str,
    mrz_line2: str,
    doc_type: str = "PASSPORT"
) -> Image.Image:
    card = Image.new("RGB", (1000, 650), color=(18, 28, 45))
    draw = ImageDraw.Draw(card)

    # Background wave pattern
    draw_guilloche_background(draw, 1000, 650)

    # Header Box
    draw.rectangle([30, 30, 970, 100], fill=(30, 41, 59), outline=(56, 189, 248), width=2)
    draw.text((50, 48), f"REPUBLIC OF {nationality.upper()}", fill=(248, 250, 252))
    draw.text((750, 48), f"{doc_type} / DOCUMENT", fill=(56, 189, 248))

    # Paste Normalized Primary Portrait Box
    norm_face = normalize_portrait(face_img)
    card.paste(norm_face, (60, 130))
    draw.rectangle([60, 130, 290, 420], outline=(56, 189, 248), width=2)

    # Ghost Watermark Portrait (secondary security)
    ghost = norm_face.copy().convert("L").resize((110, 140))
    ghost_rgba = Image.new("RGBA", ghost.size, (255, 255, 255, 0))
    ghost_np = np.array(ghost)
    ghost_rgba_np = np.zeros((140, 110, 4), dtype=np.uint8)
    ghost_rgba_np[:, :, 0] = 255
    ghost_rgba_np[:, :, 1] = 255
    ghost_rgba_np[:, :, 2] = 255
    ghost_rgba_np[:, :, 3] = (ghost_np * 0.25).astype(np.uint8)
    ghost_img = Image.fromarray(ghost_rgba_np)
    card.paste(ghost_img, (830, 270), ghost_img)

    # Fields Text (x=330)
    draw.text((330, 130), "SURNAME / NOM", fill=(148, 163, 184))
    draw.text((330, 150), surname, fill=(255, 255, 255))

    draw.text((600, 130), "GIVEN NAMES / PRENOMS", fill=(148, 163, 184))
    draw.text((600, 150), given_name, fill=(255, 255, 255))

    draw.text((330, 200), "PASSPORT NO.", fill=(148, 163, 184))
    draw.text((330, 220), passport_no, fill=(56, 189, 248))

    draw.text((600, 200), "NATIONALITY", fill=(148, 163, 184))
    draw.text((600, 220), nationality, fill=(255, 255, 255))

    draw.text((330, 270), "DATE OF BIRTH", fill=(148, 163, 184))
    draw.text((330, 290), dob_printed, fill=(255, 255, 255))

    draw.text((600, 270), "SEX", fill=(148, 163, 184))
    draw.text((600, 290), sex, fill=(255, 255, 255))

    draw.text((330, 340), "DATE OF EXPIRY", fill=(148, 163, 184))
    draw.text((330, 360), expiry_printed, fill=(52, 211, 153))

    # Bottom High-Contrast Monospace MRZ Strip (y=475..650)
    draw.rectangle([30, 475, 970, 620], fill=(255, 255, 255), outline=(0, 0, 0), width=2)
    
    # Try monospace font or default
    try:
        font_mrz = ImageFont.truetype("cour.ttf", 26)
    except Exception:
        font_mrz = ImageFont.load_default()

    draw.text((45, 495), mrz_line1, fill=(0, 0, 0), font=font_mrz)
    draw.text((45, 550), mrz_line2, fill=(0, 0, 0), font=font_mrz)

    return card

# -------------------------------------------------------------
# MAIN BUILD DATASET PIPELINE
# -------------------------------------------------------------
def build_all_datasets():
    ensure_directories()
    manifest_rows = []

    print("[Dataset] Building 5 Dataset Folders...")

    # Fetch LFW faces if available, else synthetic fallback
    lfw_faces = []
    try:
        from sklearn.datasets import fetch_lfw_people
        lfw = fetch_lfw_people(min_faces_per_person=2, resize=1.0, color=True, download_if_missing=False)
        for img_np in lfw.images[:40]:
            # Convert float/int image to PIL
            if img_np.max() <= 1.0:
                img_np = (img_np * 255).astype(np.uint8)
            else:
                img_np = img_np.astype(np.uint8)
            lfw_faces.append(Image.fromarray(img_np))
        print(f"[Dataset] Loaded {len(lfw_faces)} LFW real faces.")
    except Exception as e:
        print(f"[Dataset] LFW fetch warning: {e}. Using procedural faces.")

    while len(lfw_faces) < 40:
        lfw_faces.append(generate_procedural_face(len(lfw_faces) + 100))

    # --- 0. TEAM LIVE DEMO DATASET ---
    team_files = [f for f in os.listdir(TEAM_FACES_DIR) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    if not team_files:
        # Create a dummy team selfie if none exists
        dummy_path = os.path.join(TEAM_FACES_DIR, "team_member1.jpg")
        generate_procedural_face(42).save(dummy_path)
        team_files = ["team_member1.jpg"]

    for idx, tfile in enumerate(team_files):
        tpath = os.path.join(TEAM_FACES_DIR, tfile)
        try:
            face_img = Image.open(tpath).convert("RGB")
        except Exception:
            face_img = generate_procedural_face(idx)

        name = fake.name()
        surname = name.split()[-1]
        given_name = " ".join(name.split()[:-1]) or "MEMBER"
        pass_no = f"P{random.randint(10000000, 99999999)}"
        nat = "IND"
        dob_dt = datetime.now() - timedelta(days=random.randint(8000, 15000))
        exp_dt = datetime.now() + timedelta(days=random.randint(1000, 3000))
        
        dob_yymmdd = dob_dt.strftime("%y%m%d")
        exp_yymmdd = exp_dt.strftime("%y%m%d")
        dob_printed = dob_dt.strftime("%d/%m/%Y")
        exp_printed = exp_dt.strftime("%d/%m/%Y")

        l1, l2 = generate_icao_td3_mrz(surname, given_name, pass_no, nat, dob_yymmdd, "M", exp_yymmdd)
        card = render_passport_card(face_img, surname, given_name, pass_no, nat, dob_printed, "M", exp_printed, l1, l2)

        out_img_path = os.path.join(DATASET_DIR, "0_team_live_demo", f"team_{idx+1}_passport.jpg")
        out_json_path = os.path.join(DATASET_DIR, "0_team_live_demo", f"team_{idx+1}_passport.json")
        
        card.save(out_img_path, quality=88)

        gt_data = {
            "fullName": f"{surname}, {given_name}",
            "documentNumber": pass_no,
            "nationality": nat,
            "dateOfBirth": dob_printed,
            "dateOfExpiry": exp_printed,
            "expectedVerdict": "APPROVED",
            "fraudRiskScore": 5
        }
        with open(out_json_path, "w") as f:
            json.dump(gt_data, f, indent=2)

        manifest_rows.append(["0_team_live_demo", f"team_{idx+1}_passport.jpg", "APPROVED", 5, "Team member authentic card"])

    # --- 1. AUTHENTIC PASSPORTS (15 samples) ---
    for idx in range(15):
        face_img = lfw_faces[idx % len(lfw_faces)]
        surname = fake.last_name()
        given_name = fake.first_name()
        pass_no = f"P{random.randint(10000000, 99999999)}"
        nat = "ELD"
        dob_dt = datetime.now() - timedelta(days=random.randint(8000, 15000))
        exp_dt = datetime.now() + timedelta(days=random.randint(1000, 3000))

        dob_yymmdd = dob_dt.strftime("%y%m%d")
        exp_yymmdd = exp_dt.strftime("%y%m%d")
        dob_printed = dob_dt.strftime("%d/%m/%Y")
        exp_printed = exp_dt.strftime("%d/%m/%Y")

        l1, l2 = generate_icao_td3_mrz(surname, given_name, pass_no, nat, dob_yymmdd, "M", exp_yymmdd)
        card = render_passport_card(face_img, surname, given_name, pass_no, nat, dob_printed, "M", exp_printed, l1, l2)

        out_img_path = os.path.join(DATASET_DIR, "1_authentic_passports", f"authentic_{idx+1}.jpg")
        card.save(out_img_path, quality=88)
        manifest_rows.append(["1_authentic_passports", f"authentic_{idx+1}.jpg", "APPROVED", 6, "Valid ICAO card"])

    # --- 2. FAKE MRZ & EXPIRED (15 samples) ---
    for idx in range(15):
        face_img = lfw_faces[(idx + 15) % len(lfw_faces)]
        surname = fake.last_name()
        given_name = fake.first_name()
        pass_no = f"P{random.randint(10000000, 99999999)}"
        nat = "VAL"

        # Challenge 3: DOB Mismatch / Expired
        if idx % 2 == 0:
            dob_printed = "14/08/1998" # Front printed DOB altered
            dob_yymmdd = "820814"      # Hidden MRZ retains 1982
            exp_printed = "10/02/2029"
            exp_yymmdd = "290210"
            corrupt = False
            reason = "Modified DOB front vs MRZ"
        else:
            dob_printed = "02/08/1990"
            dob_yymmdd = "900802"
            exp_printed = "10/02/2022" # Expired doc
            exp_yymmdd = "220210"
            corrupt = True
            reason = "Expired document & Corrupted 7-3-1 Checksum"

        l1, l2 = generate_icao_td3_mrz(surname, given_name, pass_no, nat, dob_yymmdd, "M", exp_yymmdd, corrupt_check_digit=corrupt)
        card = render_passport_card(face_img, surname, given_name, pass_no, nat, dob_printed, "M", exp_printed, l1, l2)

        out_img_path = os.path.join(DATASET_DIR, "2_fake_mrz_and_expired", f"fake_mrz_{idx+1}.jpg")
        card.save(out_img_path, quality=85)
        manifest_rows.append(["2_fake_mrz_and_expired", f"fake_mrz_{idx+1}.jpg", "NOT_APPROVED", 89, reason])

    # --- 3. FAKE TAMPERED ELA (15 samples - Challenge 2 Two-Step Save) ---
    for idx in range(15):
        face_img = lfw_faces[idx % len(lfw_faces)]
        spliced_face = generate_procedural_face(idx + 500)
        surname = "KOWALSKI"
        given_name = "ALEXEI"
        pass_no = "A81920391"
        nat = "VAL"

        dob_yymmdd = "860203"
        exp_yymmdd = "281119"
        l1, l2 = generate_icao_td3_mrz(surname, given_name, pass_no, nat, dob_yymmdd, "M", exp_yymmdd)
        
        # Step A: Save base card at quality 60
        base_card = render_passport_card(face_img, surname, given_name, pass_no, nat, "03/02/1986", "M", "19/11/2028", l1, l2)
        temp_buf = io.BytesIO()
        base_card.save(temp_buf, format='JPEG', quality=60)
        temp_buf.seek(0)
        reloaded_card = Image.open(temp_buf).convert("RGB")

        # Step B: Splice different face + red stamp + save at quality 98
        norm_splice = normalize_portrait(spliced_face)
        reloaded_card.paste(norm_splice, (60, 130)) # Spliced over portrait box
        stamped_card = draw_visa_stamp(reloaded_card, "FORGED ENTRY")

        out_img_path = os.path.join(DATASET_DIR, "3_fake_tampered_ela", f"tampered_ela_{idx+1}.jpg")
        stamped_card.save(out_img_path, quality=98)
        manifest_rows.append(["3_fake_tampered_ela", f"tampered_ela_{idx+1}.jpg", "NOT_APPROVED", 94, "Photo replacement & stamp forgery"])

    # --- 4. FAKE FACE MISMATCH (15 samples) ---
    for idx in range(15):
        face_a = lfw_faces[idx % len(lfw_faces)]
        face_b = lfw_faces[(idx + 5) % len(lfw_faces)]

        l1, l2 = generate_icao_td3_mrz("VANCE", "JOHNATHAN", "P94821045", "ELD", "910418", "M", "290814")
        card = render_passport_card(face_a, "VANCE", "JOHNATHAN", "P94821045", "ELD", "18/04/1991", "M", "14/08/2029", l1, l2)

        out_doc_path = os.path.join(DATASET_DIR, "4_fake_face_mismatch", f"mismatch_{idx+1}_doc.jpg")
        out_webcam_path = os.path.join(DATASET_DIR, "4_fake_face_mismatch", f"mismatch_{idx+1}_webcam.jpg")

        card.save(out_doc_path, quality=88)
        normalize_portrait(face_b).save(out_webcam_path, quality=88)

        manifest_rows.append(["4_fake_face_mismatch", f"mismatch_{idx+1}_doc.jpg", "NOT_APPROVED", 92, "1:1 Face biometric mismatch"])

    # Write Manifest CSV
    manifest_path = os.path.join(DATASET_DIR, "ground_truth_manifest.csv")
    with open(manifest_path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["Folder", "Filename", "ExpectedVerdict", "RiskScore", "Reason"])
        writer.writerows(manifest_rows)

    print(f"[Dataset] Successfully generated evaluation dataset & manifest at {manifest_path}")

if __name__ == "__main__":
    build_all_datasets()
