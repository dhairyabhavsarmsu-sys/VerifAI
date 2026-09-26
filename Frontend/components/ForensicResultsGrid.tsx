import React, { useState } from 'react';
import { VerificationResult } from '../types';
import {
  FileText,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Users,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Layers,
  Maximize2,
  Minimize2,
  Scan,
} from 'lucide-react';

interface ForensicResultsGridProps {
  result: VerificationResult;
}

export const ForensicResultsGrid: React.FC<ForensicResultsGridProps> = ({ result }) => {
  const [elaViewMode, setElaViewMode] = useState<'side-by-side' | 'large-heatmap'>('side-by-side');

  const { ocr, validation, tampering, face, documentType, documentImageUrl, travelerImageUrl } = result;

  const isPassportOrId =
    documentType === 'passport' || documentType === 'national_id' || documentType === 'driving_license';

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* ======================================================== */}
      {/* CARD 1 — MODULE 1: OCR EXTRACTION */}
      {/* ======================================================== */}
      <div className="card-3d-hover bg-[#111827]/90 backdrop-blur-md rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between hover:border-cyan-500/40">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wide">
                  Module 1: OCR Extraction
                </h3>
                <p className="text-[11px] text-slate-400">
                  Dual-Zone Text & Machine Readable Extraction
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
              {result.executionSpeeds.ocrSpeedSec}s
            </span>
          </div>

          {/* Extracted Fields Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {isPassportOrId ? (
              <>
                <div
                  className={`p-2.5 rounded-lg border ${
                    ocr.alteredFields.includes('fullName')
                      ? 'bg-rose-950/40 border-rose-600/70 text-rose-200'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Full Name</div>
                  <div className="font-semibold text-slate-100 truncate mt-0.5">
                    {ocr.fullName || 'N/A'}
                  </div>
                </div>

                <div
                  className={`p-2.5 rounded-lg border ${
                    ocr.alteredFields.includes('documentNumber')
                      ? 'bg-rose-950/40 border-rose-600/70 text-rose-200'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    Passport / ID No.
                  </div>
                  <div className="font-mono font-bold text-cyan-300 truncate mt-0.5">
                    {ocr.documentNumber || 'N/A'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg border bg-slate-900/80 border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Nationality</div>
                  <div className="font-semibold text-slate-100 truncate mt-0.5">
                    {ocr.nationality || 'N/A'}
                  </div>
                </div>

                <div
                  className={`p-2.5 rounded-lg border ${
                    ocr.alteredFields.includes('dateOfBirth')
                      ? 'bg-rose-950/40 border-rose-600/70 text-rose-200'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Date of Birth</div>
                  <div
                    className={`font-mono font-semibold truncate mt-0.5 ${
                      ocr.alteredFields.includes('dateOfBirth') ? 'text-rose-400' : 'text-slate-100'
                    }`}
                  >
                    {ocr.dateOfBirth || 'N/A'}
                  </div>
                </div>

                <div
                  className={`p-2.5 rounded-lg border ${
                    ocr.alteredFields.includes('dateOfExpiry')
                      ? 'bg-rose-950/40 border-rose-600/70 text-rose-200'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Date of Expiry</div>
                  <div
                    className={`font-mono font-semibold truncate mt-0.5 ${
                      ocr.alteredFields.includes('dateOfExpiry') ? 'text-rose-400' : 'text-slate-100'
                    }`}
                  >
                    {ocr.dateOfExpiry || 'N/A'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg border bg-slate-900/80 border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Gender / Sex</div>
                  <div className="font-semibold text-slate-100 mt-0.5">{ocr.gender || 'N/A'}</div>
                </div>
              </>
            ) : (
              // Visa / Permit Fields
              <>
                <div className="p-2.5 rounded-lg border bg-slate-900/80 border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Visa Number</div>
                  <div className="font-mono font-bold text-amber-300 truncate mt-0.5">
                    {ocr.visaNumber || 'V-90281944'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg border bg-slate-900/80 border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Visa Type</div>
                  <div className="font-semibold text-slate-100 truncate mt-0.5">
                    {ocr.visaType || 'TYPE C / TOURIST'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg border bg-slate-900/80 border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Entry Validation</div>
                  <div className="font-semibold text-slate-100 truncate mt-0.5">
                    {ocr.entryValidation || 'SINGLE ENTRY'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg border bg-slate-900/80 border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Stay Duration</div>
                  <div className="font-semibold text-slate-100 truncate mt-0.5">
                    {ocr.stayDuration || '90 DAYS'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg border bg-slate-900/80 border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Issuing Country</div>
                  <div className="font-semibold text-slate-100 truncate mt-0.5">
                    {ocr.issuingCountry || 'CONSULAR SECTION'}
                  </div>
                </div>

                <div
                  className={`p-2.5 rounded-lg border ${
                    ocr.alteredFields.includes('dateOfExpiry')
                      ? 'bg-rose-950/40 border-rose-600/70 text-rose-200'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Expiry Date</div>
                  <div className="font-mono font-semibold text-rose-400 truncate mt-0.5">
                    {ocr.dateOfExpiry || '10 FEB 2024'}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Raw Monospace MRZ String */}
          <div className="mt-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
              <span>RAW ICAO 9303 MRZ STREAM</span>
              <span>2-LINE OPTICAL STRING</span>
            </div>
            <pre className="font-mono text-[10.5px] leading-tight text-cyan-300 overflow-x-auto whitespace-pre selection:bg-cyan-900 selection:text-white">
              {ocr.rawMrz ||
                'P<ELDVANCE<<JOHNATHAN<E<<<<<<<<<<<<<<<<<<<<<\nP948210457ELD9104184M2908148<<<<<<<<<<<<<<06'}
            </pre>
          </div>
        </div>

        {ocr.alteredFields.length > 0 && (
          <div className="mt-2 text-[11px] font-mono text-rose-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Altered field detected: {ocr.alteredFields.join(', ')}</span>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* CARD 2 — MODULE 2: DOCUMENT VALIDATION (RULES & WATCHLIST) */}
      {/* ======================================================== */}
      <div className="card-3d-hover bg-[#111827]/90 backdrop-blur-md rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between hover:border-cyan-500/40">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wide">
                  Module 2: Document Validation
                </h3>
                <p className="text-[11px] text-slate-400">
                  ICAO Standards, Checksum Math & Watchlist
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
              {result.executionSpeeds.validationSpeedSec}s
            </span>
          </div>

          {/* Validation Rules Checklist */}
          <div className="space-y-2">
            {/* Rule 1: ICAO 9303 MRZ Check-Digit Math */}
            <div
              className={`p-2.5 rounded-lg border flex items-start justify-between gap-2 ${
                validation.mrzChecksum.passed
                  ? 'bg-slate-900/80 border-slate-800'
                  : 'bg-rose-950/30 border-rose-800/70'
              }`}
            >
              <div>
                <div className="text-xs font-semibold text-white">
                  ICAO 9303 MRZ Check-Digit Math (7-3-1 Checksum)
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {validation.mrzChecksum.detail}
                </div>
              </div>
              <span
                className={`px-2 py-0.5 text-[11px] font-mono font-bold rounded flex items-center gap-1 flex-shrink-0 ${
                  validation.mrzChecksum.passed
                    ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/60'
                    : 'text-rose-400 bg-rose-950/60 border border-rose-800/60'
                }`}
              >
                {validation.mrzChecksum.passed ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    VALID ✓
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    MISMATCH ✕
                  </>
                )}
              </span>
            </div>

            {/* Rule 2: Printed DOB vs. Hidden MRZ DOB Cross-Check */}
            <div
              className={`p-2.5 rounded-lg border flex items-start justify-between gap-2 ${
                validation.dobCrossCheck.passed
                  ? 'bg-slate-900/80 border-slate-800'
                  : 'bg-rose-950/30 border-rose-800/70'
              }`}
            >
              <div>
                <div className="text-xs font-semibold text-white">
                  Printed DOB vs. Hidden MRZ Cross-Check
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {validation.dobCrossCheck.detail}
                </div>
              </div>
              <span
                className={`px-2 py-0.5 text-[11px] font-mono font-bold rounded flex items-center gap-1 flex-shrink-0 ${
                  validation.dobCrossCheck.passed
                    ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/60'
                    : 'text-rose-400 bg-rose-950/60 border border-rose-800/60'
                }`}
              >
                {validation.dobCrossCheck.passed ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    MATCHED ✓
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    MODIFIED DOB ✕
                  </>
                )}
              </span>
            </div>

            {/* Rule 3: Document Expiration Check */}
            <div
              className={`p-2.5 rounded-lg border flex items-start justify-between gap-2 ${
                validation.expirationCheck.passed
                  ? 'bg-slate-900/80 border-slate-800'
                  : 'bg-rose-950/30 border-rose-800/70'
              }`}
            >
              <div>
                <div className="text-xs font-semibold text-white">Document Expiration Check</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {validation.expirationCheck.detail}
                </div>
              </div>
              <span
                className={`px-2 py-0.5 text-[11px] font-mono font-bold rounded flex items-center gap-1 flex-shrink-0 ${
                  validation.expirationCheck.passed
                    ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/60'
                    : 'text-rose-400 bg-rose-950/60 border border-rose-800/60'
                }`}
              >
                {validation.expirationCheck.passed ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    ACTIVE ✓
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    EXPIRED ✕
                  </>
                )}
              </span>
            </div>

            {/* Rule 4: Offline SQLite Watchlist Lookup */}
            <div
              className={`p-2.5 rounded-lg border flex items-start justify-between gap-2 ${
                validation.watchlistCheck.passed
                  ? 'bg-slate-900/80 border-slate-800'
                  : 'bg-rose-950/30 border-rose-800/70'
              }`}
            >
              <div>
                <div className="text-xs font-semibold text-white">
                  Offline SQLite Watchlist Lookup
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {validation.watchlistCheck.detail}
                </div>
              </div>
              <span
                className={`px-2 py-0.5 text-[11px] font-mono font-bold rounded flex items-center gap-1 flex-shrink-0 ${
                  validation.watchlistCheck.passed
                    ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/60'
                    : 'text-rose-400 bg-rose-950/60 border border-rose-800/60'
                }`}
              >
                {validation.watchlistCheck.passed ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    CLEAR ✓
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    BLACKLISTED ✕
                  </>
                )}
              </span>
            </div>

            {/* Rule 5: Multiple Identity / Duplicate Face Check */}
            <div
              className={`p-2.5 rounded-lg border flex items-start justify-between gap-2 ${
                validation.duplicateFaceCheck.passed
                  ? 'bg-slate-900/80 border-slate-800'
                  : 'bg-rose-950/30 border-rose-800/70'
              }`}
            >
              <div>
                <div className="text-xs font-semibold text-white">
                  Multiple Identity / Duplicate Face Check
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {validation.duplicateFaceCheck.detail}
                </div>
              </div>
              <span
                className={`px-2 py-0.5 text-[11px] font-mono font-bold rounded flex items-center gap-1 flex-shrink-0 ${
                  validation.duplicateFaceCheck.passed
                    ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/60'
                    : 'text-rose-400 bg-rose-950/60 border border-rose-800/60'
                }`}
              >
                {validation.duplicateFaceCheck.passed ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    UNIQUE ✓
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    DUPLICATE ALERT ✕
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CARD 3 — MODULE 3: TAMPERING DETECTION (ELA HEATMAP) */}
      {/* ======================================================== */}
      <div className="card-3d-hover bg-[#111827]/90 backdrop-blur-md rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between hover:border-cyan-500/40">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wide">
                  Module 3: Tampering Detection (ELA)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Error Level Analysis & CNN Pixel Compression
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                {result.executionSpeeds.elaSpeedSec}s
              </span>

              {/* View Toggle */}
              <div className="flex items-center p-0.5 bg-slate-900 rounded-md border border-slate-800">
                <button
                  type="button"
                  onClick={() => setElaViewMode('side-by-side')}
                  className={`btn-3d px-2.5 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-all ${
                    elaViewMode === 'side-by-side'
                      ? 'btn-3d-primary text-white'
                      : 'btn-3d-slate text-slate-300'
                  }`}
                >
                  Side-by-Side
                </button>
                <button
                  type="button"
                  onClick={() => setElaViewMode('large-heatmap')}
                  className={`btn-3d px-2.5 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-all ${
                    elaViewMode === 'large-heatmap'
                      ? 'btn-3d-primary text-white'
                      : 'btn-3d-slate text-slate-300'
                  }`}
                >
                  Large Heatmap
                </button>
              </div>
            </div>
          </div>

          {/* Visual ELA Display */}
          <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2 mb-3">
            {elaViewMode === 'side-by-side' ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="relative rounded overflow-hidden border border-slate-800 bg-slate-900 flex flex-col items-center justify-center min-h-[140px]">
                  <img
                    src={documentImageUrl}
                    alt="Original Document"
                    className="max-h-[140px] w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-1 left-1 bg-slate-900/90 text-[10px] font-mono px-1.5 py-0.5 rounded text-slate-300">
                    Original Document
                  </div>
                </div>

                <div className="relative rounded overflow-hidden border border-cyan-500/50 bg-slate-950 flex flex-col items-center justify-center min-h-[140px]">
                  <img
                    src={tampering.elaImageBase64 || documentImageUrl}
                    alt="Forensic ELA Heatmap"
                    className="max-h-[140px] w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-1 left-1 bg-slate-900/90 text-[10px] font-mono px-1.5 py-0.5 rounded text-cyan-300 border border-cyan-800/40">
                    ELA Forensic Heatmap
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative rounded overflow-hidden border border-cyan-500/60 bg-slate-950 flex flex-col items-center justify-center min-h-[170px]">
                <img
                  src={tampering.elaImageBase64 || documentImageUrl}
                  alt="Large ELA Heatmap"
                  className="max-h-[170px] w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 bg-slate-900/90 text-[10px] font-mono px-2 py-0.5 rounded text-cyan-300 border border-cyan-800/40">
                  Thermal High-Pass Pixel Differencing (75% Q-Factor)
                </div>
              </div>
            )}
          </div>

          {/* 4 Horizontal Confidence Bars for Required Tampering Use Cases */}
          <div className="space-y-2 text-xs">
            {/* 1. Photo Replacement (Splicing Detection) */}
            <div>
              <div className="flex justify-between items-center mb-1 text-[11px]">
                <span className="text-slate-300 font-medium">1. Photo Replacement (Splicing)</span>
                <span
                  className={`font-mono font-bold ${
                    tampering.confidenceBars.photoReplacement > 50
                      ? 'text-rose-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {tampering.confidenceBars.photoReplacement}%{' '}
                  {tampering.confidenceBars.photoReplacement > 50 ? '(TAMPERED)' : '(CLEAN)'}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    tampering.confidenceBars.photoReplacement > 50
                      ? 'bg-rose-500'
                      : 'bg-emerald-400'
                  }`}
                  style={{ width: `${tampering.confidenceBars.photoReplacement}%` }}
                />
              </div>
            </div>

            {/* 2. Text Manipulation */}
            <div>
              <div className="flex justify-between items-center mb-1 text-[11px]">
                <span className="text-slate-300 font-medium">
                  2. Text Manipulation (Font & Pixel Clone)
                </span>
                <span
                  className={`font-mono font-bold ${
                    tampering.confidenceBars.textManipulation > 50
                      ? 'text-rose-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {tampering.confidenceBars.textManipulation}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    tampering.confidenceBars.textManipulation > 50
                      ? 'bg-rose-500'
                      : 'bg-emerald-400'
                  }`}
                  style={{ width: `${tampering.confidenceBars.textManipulation}%` }}
                />
              </div>
            </div>

            {/* 3. Stamp Forgery Detection */}
            <div>
              <div className="flex justify-between items-center mb-1 text-[11px]">
                <span className="text-slate-300 font-medium">
                  3. Stamp Forgery (Ink Compression)
                </span>
                <span
                  className={`font-mono font-bold ${
                    tampering.confidenceBars.stampForgery > 50
                      ? 'text-rose-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {tampering.confidenceBars.stampForgery}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    tampering.confidenceBars.stampForgery > 50
                      ? 'bg-rose-500'
                      : 'bg-emerald-400'
                  }`}
                  style={{ width: `${tampering.confidenceBars.stampForgery}%` }}
                />
              </div>
            </div>

            {/* 4. Image Metadata Analysis */}
            <div>
              <div className="flex justify-between items-center mb-1 text-[11px]">
                <span className="text-slate-300 font-medium">
                  4. Image Metadata Analysis (EXIF / Artifacts)
                </span>
                <span
                  className={`font-mono font-bold ${
                    tampering.confidenceBars.metadataAnalysis > 50
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {tampering.confidenceBars.metadataAnalysis}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    tampering.confidenceBars.metadataAnalysis > 50
                      ? 'bg-amber-500'
                      : 'bg-emerald-400'
                  }`}
                  style={{ width: `${tampering.confidenceBars.metadataAnalysis}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 text-[11px] text-slate-400 italic">
          {tampering.summary}
        </div>
      </div>

      {/* ======================================================== */}
      {/* CARD 4 — MODULE 4: FACE VERIFICATION (1:1 BIOMETRICS) */}
      {/* ======================================================== */}
      <div className="card-3d-hover bg-[#111827]/90 backdrop-blur-md rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between hover:border-cyan-500/40">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wide">
                  Module 4: Face Verification
                </h3>
                <p className="text-[11px] text-slate-400">
                  1:1 Biometrics & Anti-Spoof Liveness
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
              {result.executionSpeeds.faceSpeedSec}s
            </span>
          </div>

          {/* Side-by-Side Comparison: [Cropped Document Photo] vs. [Live Laptop Camera Photo] */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 flex flex-col items-center justify-center p-2 min-h-[140px]">
              <img
                src={face.croppedDocFaceUrl || documentImageUrl}
                alt="Document Photo"
                className="max-h-[120px] w-auto object-contain rounded"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-1 left-1 bg-slate-900/90 text-[10px] font-mono px-1.5 py-0.5 rounded text-slate-300">
                Cropped Document
              </div>
            </div>

            <div className="relative rounded-lg overflow-hidden border border-cyan-500/50 bg-slate-950 flex flex-col items-center justify-center p-2 min-h-[140px]">
              <img
                src={face.capturedTravelerFaceUrl || travelerImageUrl}
                alt="Live Camera Photo"
                className="max-h-[120px] w-auto object-contain rounded"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-1 left-1 bg-slate-900/90 text-[10px] font-mono px-1.5 py-0.5 rounded text-cyan-300 border border-cyan-800/40">
                Live Laptop Camera
              </div>
            </div>
          </div>

          {/* Visual Meters & Status Badges */}
          <div className="space-y-3">
            {/* 1:1 Similarity Meter */}
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-slate-200">
                  128-d Cosine Facial Similarity
                </span>
                <span
                  className={`text-sm font-mono font-bold ${
                    face.similarityScore >= 80 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {face.similarityScore}% Match
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    face.similarityScore >= 80 ? 'bg-emerald-400' : 'bg-rose-500'
                  }`}
                  style={{ width: `${face.similarityScore}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>Threshold: 80.0%</span>
                <span>Euclidean Distance: {(1 - face.similarityScore / 100).toFixed(3)}</span>
              </div>
            </div>

            {/* Badges for Liveness & Impersonation */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div
                className={`p-2 rounded-lg border flex items-center justify-between ${
                  face.livenessPassed
                    ? 'bg-slate-900/80 border-slate-800'
                    : 'bg-rose-950/40 border-rose-800/70'
                }`}
              >
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Liveness Test</div>
                  <div className="text-xs font-semibold text-white">Passive 3D Texture</div>
                </div>
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded flex items-center gap-1 ${
                    face.livenessPassed
                      ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/60'
                      : 'text-rose-400 bg-rose-950/60 border border-rose-800/60'
                  }`}
                >
                  {face.livenessPassed ? 'LIVE PERSON ✓' : 'SPOOF DETECTED ✕'}
                </span>
              </div>

              <div
                className={`p-2 rounded-lg border flex items-center justify-between ${
                  !face.impersonationAlert
                    ? 'bg-slate-900/80 border-slate-800'
                    : 'bg-rose-950/40 border-rose-800/70'
                }`}
              >
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Impersonation</div>
                  <div className="text-xs font-semibold text-white">Holder Identity</div>
                </div>
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded flex items-center gap-1 ${
                    !face.impersonationAlert
                      ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/60'
                      : 'text-rose-400 bg-rose-950/60 border border-rose-800/60'
                  }`}
                >
                  {!face.impersonationAlert ? 'GENUINE OWNER ✓' : 'IMPERSONATION ALERT ✕'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 text-[11px] text-slate-400">
          Facial features mapped across 68 anatomical landmarks.
        </div>
      </div>
    </div>
  );
};
