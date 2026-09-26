import { DemoPreset, VerificationResult } from '../types';

// High-fidelity SVG Data URLs for the demo identity documents and travelers

// Genuine Passport (Clean, valid MRZ, genuine biometric photo)
export const GENUINE_PASSPORT_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" width="800" height="520">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <pattern id="guilloche" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 0 20 Q 10 0 20 20 T 40 20" fill="none" stroke="#334155" stroke-width="0.8" opacity="0.4"/>
      <circle cx="20" cy="20" r="14" fill="none" stroke="#334155" stroke-width="0.5" opacity="0.3"/>
    </pattern>
  </defs>

  <!-- Document Card Base -->
  <rect width="800" height="520" rx="16" fill="url(#bg)" stroke="#38bdf8" stroke-width="2"/>
  <rect width="800" height="520" fill="url(#guilloche)"/>

  <!-- Top Header -->
  <rect x="24" y="24" width="752" height="60" rx="8" fill="#1e1e38" opacity="0.8"/>
  <text x="50" y="62" font-family="Arial, sans-serif" font-weight="bold" font-size="22" fill="#f8fafc" letter-spacing="4">UNITED REPUBLIC OF ELIDOR</text>
  <text x="640" y="60" font-family="monospace" font-size="14" fill="#38bdf8">PASSPORT / PASSEPORT</text>

  <!-- Portrait Frame -->
  <g transform="translate(50, 110)">
    <rect width="180" height="230" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
    <!-- Realistic Avatar Silhouette & Details -->
    <rect width="180" height="230" rx="8" fill="#334155"/>
    <circle cx="90" cy="85" r="45" fill="#fbcfe8"/>
    <path d="M 45 65 Q 90 35 135 65 Q 110 50 90 52 Z" fill="#3b0764"/>
    <ellipse cx="75" cy="85" rx="5" ry="4" fill="#1e293b"/>
    <ellipse cx="105" cy="85" rx="5" ry="4" fill="#1e293b"/>
    <path d="M 82 108 Q 90 114 98 108" stroke="#be185d" stroke-width="2" fill="none"/>
    <path d="M 30 215 C 30 160 60 145 90 145 C 120 145 150 160 150 215 Z" fill="#0284c7"/>
    <text x="90" y="222" font-family="monospace" font-size="10" fill="#94a3b8" text-anchor="middle">OFFICIAL BIOMETRIC</text>
  </g>

  <!-- Official Security Seal -->
  <circle cx="700" cy="180" r="48" fill="none" stroke="url(#gold)" stroke-width="3" stroke-dasharray="6,4"/>
  <polygon points="700,145 710,170 735,170 715,185 722,210 700,195 678,210 685,185 665,170 690,170" fill="url(#gold)" opacity="0.8"/>
  <text x="700" y="240" font-family="monospace" font-size="11" fill="#f59e0b" text-anchor="middle">OFFICIAL IMMIGRATION</text>

  <!-- Fields (Passport Info) -->
  <g transform="translate(260, 110)" font-family="Arial, sans-serif">
    <text x="0" y="15" font-size="11" fill="#94a3b8">SURNAME / NOM</text>
    <text x="0" y="38" font-size="18" font-weight="bold" fill="#ffffff" letter-spacing="1">VANCE</text>

    <text x="240" y="15" font-size="11" fill="#94a3b8">GIVEN NAMES / PRENOMS</text>
    <text x="240" y="38" font-size="18" font-weight="bold" fill="#ffffff">JOHNATHAN E.</text>

    <text x="0" y="75" font-size="11" fill="#94a3b8">PASSPORT NO.</text>
    <text x="0" y="96" font-size="17" font-family="monospace" font-weight="bold" fill="#38bdf8">P94821045</text>

    <text x="240" y="75" font-size="11" fill="#94a3b8">NATIONALITY / NATIONALITE</text>
    <text x="240" y="96" font-size="16" font-weight="bold" fill="#ffffff">ELD / ELIDORIAN</text>

    <text x="0" y="135" font-size="11" fill="#94a3b8">DATE OF BIRTH / DATE DE NAISSANCE</text>
    <text x="0" y="156" font-size="16" font-family="monospace" font-weight="bold" fill="#ffffff">18 APR 1991</text>

    <text x="240" y="135" font-size="11" fill="#94a3b8">SEX / SEXE</text>
    <text x="240" y="156" font-size="16" font-weight="bold" fill="#ffffff">M</text>

    <text x="0" y="195" font-size="11" fill="#94a3b8">DATE OF EXPIRY / DATE D'EXPIRATION</text>
    <text x="0" y="216" font-size="16" font-family="monospace" font-weight="bold" fill="#34d399">14 AUG 2029</text>

    <text x="240" y="195" font-size="11" fill="#94a3b8">AUTHORITY</text>
    <text x="240" y="216" font-size="15" fill="#e2e8f0">MINISTRY OF INTERIOR</text>
  </g>

  <!-- MRZ Zone (Bottom) -->
  <rect x="24" y="380" width="752" height="116" rx="8" fill="#0b1120" stroke="#334155" stroke-width="1"/>
  <text x="40" y="425" font-family="Courier, monospace" font-size="20" font-weight="bold" fill="#e2e8f0" letter-spacing="4">P&lt;ELDVANCE&lt;&lt;JOHNATHAN&lt;E&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</text>
  <text x="40" y="465" font-family="Courier, monospace" font-size="20" font-weight="bold" fill="#e2e8f0" letter-spacing="4">P948210457ELD9104184M2908148&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;06</text>
</svg>
`)}`;

// Altered Passport with Spliced Photo & Forged Consulate Stamp (Tampered)
export const TAMPERED_PASSPORT_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" width="800" height="520">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ef4444"/>
      <stop offset="100%" stop-color="#b91c1c"/>
    </linearGradient>
  </defs>

  <rect width="800" height="520" rx="16" fill="url(#bg)" stroke="#ef4444" stroke-width="2"/>
  
  <rect x="24" y="24" width="752" height="60" rx="8" fill="#2d1515" opacity="0.9"/>
  <text x="50" y="62" font-family="Arial, sans-serif" font-weight="bold" font-size="22" fill="#f8fafc" letter-spacing="4">REPUBLIC OF VALORIA</text>
  <text x="640" y="60" font-family="monospace" font-size="14" fill="#f87171">PASSPORT / PASSEPORT</text>

  <!-- Spliced / Pasted Photo Frame (Notice visible mismatch outline) -->
  <g transform="translate(50, 110)">
    <rect width="180" height="230" rx="4" fill="#0f172a" stroke="#ef4444" stroke-width="3" stroke-dasharray="4,2"/>
    <rect x="4" y="4" width="172" height="222" fill="#475569"/>
    <!-- Altered Face (Different subject pasted) -->
    <circle cx="90" cy="85" r="45" fill="#fde047"/>
    <ellipse cx="75" cy="85" rx="6" ry="5" fill="#020617"/>
    <ellipse cx="105" cy="85" rx="6" ry="5" fill="#020617"/>
    <path d="M 75 110 Q 90 120 105 110" stroke="#000" stroke-width="3" fill="none"/>
    <path d="M 25 210 C 25 150 60 140 90 140 C 120 140 155 150 155 210 Z" fill="#15803d"/>
    <rect x="10" y="10" width="160" height="20" fill="rgba(239, 68, 68, 0.85)"/>
    <text x="90" y="24" font-family="monospace" font-size="11" font-weight="bold" fill="#fff" text-anchor="middle">SPLICED PHOTO PIXELS</text>
  </g>

  <!-- Forged Stamp Overlay -->
  <g transform="translate(620, 140)">
    <circle cx="50" cy="50" r="48" fill="none" stroke="#ef4444" stroke-width="3"/>
    <circle cx="50" cy="50" r="42" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,3"/>
    <text x="50" y="45" font-family="monospace" font-size="11" font-weight="bold" fill="#ef4444" text-anchor="middle">CONSULATE</text>
    <text x="50" y="62" font-family="monospace" font-size="13" font-weight="bold" fill="#ef4444" text-anchor="middle">FORGED INK</text>
  </g>

  <g transform="translate(260, 110)" font-family="Arial, sans-serif">
    <text x="0" y="15" font-size="11" fill="#94a3b8">SURNAME / NOM</text>
    <text x="0" y="38" font-size="18" font-weight="bold" fill="#ffffff">KOWALSKI</text>

    <text x="240" y="15" font-size="11" fill="#94a3b8">GIVEN NAMES</text>
    <text x="240" y="38" font-size="18" font-weight="bold" fill="#ffffff">ALEXEI</text>

    <text x="0" y="75" font-size="11" fill="#94a3b8">PASSPORT NO.</text>
    <text x="0" y="96" font-size="17" font-family="monospace" font-weight="bold" fill="#f87171">A81920391</text>

    <text x="240" y="75" font-size="11" fill="#94a3b8">NATIONALITY</text>
    <text x="240" y="96" font-size="16" font-weight="bold" fill="#ffffff">VAL / VALORIAN</text>

    <text x="0" y="135" font-size="11" fill="#94a3b8">DATE OF BIRTH</text>
    <text x="0" y="156" font-size="16" font-family="monospace" font-weight="bold" fill="#ffffff">03 FEB 1986</text>

    <text x="240" y="135" font-size="11" fill="#94a3b8">DATE OF EXPIRY</text>
    <text x="240" y="156" font-size="16" font-family="monospace" font-weight="bold" fill="#ffffff">19 NOV 2028</text>
  </g>

  <!-- MRZ Zone -->
  <rect x="24" y="380" width="752" height="116" rx="8" fill="#140b0b" stroke="#ef4444" stroke-width="1.5"/>
  <text x="40" y="425" font-family="Courier, monospace" font-size="20" font-weight="bold" fill="#fca5a5" letter-spacing="4">P&lt;VALKOWALSKI&lt;&lt;ALEXEI&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</text>
  <text x="40" y="465" font-family="Courier, monospace" font-size="20" font-weight="bold" fill="#fca5a5" letter-spacing="4">A819203918VAL8602035M2811192&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;94</text>
</svg>
`)}`;

// Demo 3: Modified DOB & Expired Visa (Mismatch)
export const MODIFIED_DOB_VISA_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" width="800" height="520">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>

  <rect width="800" height="520" rx="16" fill="url(#bg)" stroke="#f59e0b" stroke-width="2"/>
  
  <rect x="24" y="24" width="752" height="60" rx="8" fill="#2e1065" opacity="0.9"/>
  <text x="50" y="62" font-family="Arial, sans-serif" font-weight="bold" font-size="22" fill="#f8fafc" letter-spacing="4">SHENG STATE SCHENGEN VISA</text>
  <text x="620" y="60" font-family="monospace" font-size="14" fill="#fbbf24">TYPE C / SINGLE ENTRY</text>

  <g transform="translate(50, 110)">
    <rect width="180" height="230" rx="6" fill="#334155" stroke="#f59e0b" stroke-width="1.5"/>
    <circle cx="90" cy="85" r="45" fill="#fbcfe8"/>
    <ellipse cx="75" cy="85" rx="5" ry="4" fill="#0f172a"/>
    <ellipse cx="105" cy="85" rx="5" ry="4" fill="#0f172a"/>
    <path d="M 30 215 C 30 160 60 145 90 145 C 120 145 150 160 150 215 Z" fill="#6366f1"/>
    <text x="90" y="222" font-family="monospace" font-size="10" fill="#cbd5e1" text-anchor="middle">TRAVELER BIO</text>
  </g>

  <g transform="translate(260, 110)" font-family="Arial, sans-serif">
    <text x="0" y="15" font-size="11" fill="#94a3b8">BEARER NAME</text>
    <text x="0" y="38" font-size="18" font-weight="bold" fill="#ffffff">TARIQ AL-MANSOOR</text>

    <text x="240" y="15" font-size="11" fill="#94a3b8">VISA NUMBER</text>
    <text x="240" y="38" font-size="17" font-family="monospace" font-weight="bold" fill="#f59e0b">V-90281944</text>

    <text x="0" y="75" font-size="11" fill="#ef4444">PRINTED DOB (MODIFIED TEXT)</text>
    <rect x="-4" y="80" width="200" height="28" fill="#450a0a" stroke="#ef4444" stroke-width="1.5" rx="4"/>
    <text x="6" y="99" font-size="16" font-family="monospace" font-weight="bold" fill="#f87171">12 MAY 1998 [CLONED]</text>

    <text x="240" y="75" font-size="11" fill="#ef4444">EXPIRY DATE (STATUS: EXPIRED)</text>
    <rect x="236" y="80" width="200" height="28" fill="#450a0a" stroke="#ef4444" stroke-width="1.5" rx="4"/>
    <text x="246" y="99" font-size="16" font-family="monospace" font-weight="bold" fill="#f87171">10 FEB 2024 (EXPIRED)</text>

    <text x="0" y="145" font-size="11" fill="#94a3b8">VALID FROM</text>
    <text x="0" y="166" font-size="15" fill="#e2e8f0">11 NOV 2023</text>

    <text x="240" y="145" font-size="11" fill="#94a3b8">DURATION OF STAY</text>
    <text x="240" y="166" font-size="15" fill="#e2e8f0">90 DAYS</text>

    <text x="0" y="200" font-size="11" fill="#94a3b8">ISSUING POST</text>
    <text x="0" y="220" font-size="15" fill="#e2e8f0">CONSULAR SECTION DUBAI</text>
  </g>

  <!-- MRZ Zone showing hidden DOB mismatch (820512 vs printed 980512) -->
  <rect x="24" y="380" width="752" height="116" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="40" y="425" font-family="Courier, monospace" font-size="20" font-weight="bold" fill="#cbd5e1" letter-spacing="4">V&lt;AREALMANSOOR&lt;&lt;TARIQ&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</text>
  <text x="40" y="465" font-family="Courier, monospace" font-size="20" font-weight="bold" fill="#ef4444" letter-spacing="4">V902819448ARE8205127M2402102&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;18</text>
</svg>
`)}`;

// Traveler Live Camera Presets
export const TRAVELER_JOHNATHAN_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="#0b1329"/>
  <!-- Centered live face simulation -->
  <circle cx="200" cy="180" r="90" fill="#fbcfe8"/>
  <path d="M 110 140 Q 200 80 290 140 Q 240 110 200 115 Z" fill="#3b0764"/>
  <ellipse cx="170" cy="180" rx="9" ry="7" fill="#1e293b"/>
  <ellipse cx="230" cy="180" rx="9" ry="7" fill="#1e293b"/>
  <path d="M 185 225 Q 200 238 215 225" stroke="#be185d" stroke-width="3" fill="none"/>
  <path d="M 70 380 C 70 290 130 260 200 260 C 270 260 330 290 330 380 Z" fill="#0284c7"/>
  <!-- Facial alignment hud -->
  <circle cx="200" cy="180" r="130" fill="none" stroke="#06b6d4" stroke-width="1.5" stroke-dasharray="6,6"/>
  <text x="200" y="380" font-family="monospace" font-size="12" fill="#06b6d4" text-anchor="middle">LIVE WEBCAM STREAM (30 FPS)</text>
</svg>
`)}`;

export const TRAVELER_IMPOSTOR_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="#1c0d0d"/>
  <!-- Impostor Face (Totally different facial structure) -->
  <circle cx="200" cy="175" r="95" fill="#fed7aa"/>
  <ellipse cx="165" cy="170" rx="10" ry="8" fill="#18181b"/>
  <ellipse cx="235" cy="170" rx="10" ry="8" fill="#18181b"/>
  <path d="M 170 230 Q 200 215 230 230" stroke="#7c2d12" stroke-width="4" fill="none"/>
  <path d="M 60 380 C 60 280 120 250 200 250 C 280 250 340 280 340 380 Z" fill="#b91c1c"/>
  <circle cx="200" cy="180" r="130" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="8,4"/>
  <text x="200" y="380" font-family="monospace" font-size="12" fill="#ef4444" text-anchor="middle">LIVE STREAM: UNMATCHED SUBJECT</text>
</svg>
`)}`;

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'demo-1',
    title: 'Demo 1: Genuine Passport',
    badge: 'CLEARANCE',
    type: 'passport',
    description: 'Clean traveler passport with valid ICAO 9303 checksum, uncompressed photo, and matching live face.',
    expectedVerdict: 'APPROVED',
    documentImage: GENUINE_PASSPORT_SVG,
    travelerImage: TRAVELER_JOHNATHAN_SVG,
    mockResult: {
      id: 'VERIF-7829-OK',
      timestamp: new Date().toLocaleTimeString(),
      documentType: 'passport',
      verdict: 'APPROVED',
      fraudRiskScore: 6,
      failureReasons: [],
      executionSpeeds: {
        ocrSpeedSec: 0.14,
        validationSpeedSec: 0.08,
        elaSpeedSec: 0.22,
        faceSpeedSec: 0.18,
        totalTimeSec: 0.62,
      },
      ocr: {
        fullName: 'VANCE, JOHNATHAN E.',
        documentNumber: 'P94821045',
        nationality: 'ELD (ELIDORIAN)',
        dateOfBirth: '1991-04-18',
        dateOfExpiry: '2029-08-14',
        gender: 'M',
        rawMrz: 'P<ELDVANCE<<JOHNATHAN<E<<<<<<<<<<<<<<<<<<<<<\nP948210457ELD9104184M2908148<<<<<<<<<<<<<<06',
        alteredFields: [],
      },
      validation: {
        mrzChecksum: {
          passed: true,
          code: 'ICAO_9303_OK',
          title: 'ICAO 9303 MRZ Check-Digit Math',
          detail: '7-3-1 Weighting check-digits valid across Passport No, DOB, and Expiration.',
        },
        dobCrossCheck: {
          passed: true,
          code: 'DOB_CROSS_MATCH',
          title: 'Printed DOB vs. Hidden MRZ Cross-Check',
          detail: 'Visual printed DOB (1991-04-18) perfectly matches MRZ encoded string (910418).',
        },
        expirationCheck: {
          passed: true,
          code: 'DOC_ACTIVE',
          title: 'Document Expiration Check',
          detail: 'Document is currently valid. Expiration in 2029 (active status).',
        },
        watchlistCheck: {
          passed: true,
          code: 'WATCHLIST_CLEAR',
          title: 'Offline SQLite Watchlist Lookup',
          detail: 'No hits in Interpol red notices or domestic border security blacklist.',
        },
        duplicateFaceCheck: {
          passed: true,
          code: 'BIOMETRIC_UNIQUE',
          title: 'Multiple Identity / Duplicate Face Check',
          detail: 'Biometric template is unique; no concurrent alias profiles detected.',
        },
      },
      tampering: {
        detectedBoxes: [],
        confidenceBars: {
          photoReplacement: 4,
          textManipulation: 5,
          stampForgery: 3,
          metadataAnalysis: 2,
        },
        summary: 'Zero pixel compression anomalies detected. Compression levels are uniform across all quadrants.',
        tamperingDetected: false,
      },
      face: {
        similarityScore: 96.8,
        livenessPassed: true,
        impersonationAlert: false,
        croppedDocFaceUrl: TRAVELER_JOHNATHAN_SVG,
        capturedTravelerFaceUrl: TRAVELER_JOHNATHAN_SVG,
      },
      documentImageUrl: GENUINE_PASSPORT_SVG,
      travelerImageUrl: TRAVELER_JOHNATHAN_SVG,
    },
  },
  {
    id: 'demo-2',
    title: 'Demo 2: Altered Photo & Stamp',
    badge: 'REJECT / FORGERY',
    type: 'passport',
    description: 'Photo splicing detected in passport portrait box along with digital clone stamp insertion.',
    expectedVerdict: 'NOT_APPROVED',
    documentImage: TAMPERED_PASSPORT_SVG,
    travelerImage: TRAVELER_IMPOSTOR_SVG,
    mockResult: {
      id: 'VERIF-9104-ALERT',
      timestamp: new Date().toLocaleTimeString(),
      documentType: 'passport',
      verdict: 'NOT_APPROVED',
      fraudRiskScore: 94,
      failureReasons: [
        'Photo Replacement & Splicing Detected on ELA Heatmap (94% confidence)',
        'Consulate Entry Stamp Forgery / Ink Mismatch (88% confidence)',
        '1:1 Facial Similarity Failure: Traveler does not match document holder (32.1% cosine similarity)',
      ],
      executionSpeeds: {
        ocrSpeedSec: 0.16,
        validationSpeedSec: 0.09,
        elaSpeedSec: 0.24,
        faceSpeedSec: 0.19,
        totalTimeSec: 0.68,
      },
      ocr: {
        fullName: 'KOWALSKI, ALEXEI',
        documentNumber: 'A81920391',
        nationality: 'VAL (VALORIAN)',
        dateOfBirth: '1986-02-03',
        dateOfExpiry: '2028-11-19',
        gender: 'M',
        rawMrz: 'P<VALKOWALSKI<<ALEXEI<<<<<<<<<<<<<<<<<<<<<<<\nA819203918VAL8602035M2811192<<<<<<<<<<<<<<94',
        alteredFields: ['fullName', 'photoFrame', 'consulateStamp'],
      },
      validation: {
        mrzChecksum: {
          passed: true,
          code: 'ICAO_9303_OK',
          title: 'ICAO 9303 MRZ Check-Digit Math',
          detail: 'MRZ checksum digits calculate correctly.',
        },
        dobCrossCheck: {
          passed: true,
          code: 'DOB_CROSS_MATCH',
          title: 'Printed DOB vs. Hidden MRZ Cross-Check',
          detail: 'Visual printed DOB matches encoded string.',
        },
        expirationCheck: {
          passed: true,
          code: 'DOC_ACTIVE',
          title: 'Document Expiration Check',
          detail: 'Expiration year 2028 within validity span.',
        },
        watchlistCheck: {
          passed: false,
          code: 'WATCHLIST_HIT',
          title: 'Offline SQLite Watchlist Lookup',
          detail: 'FLAG: Document serial matches known stolen blank passport series VAL-2023-B.',
        },
        duplicateFaceCheck: {
          passed: false,
          code: 'DUPLICATE_FACE_ALERT',
          title: 'Multiple Identity / Duplicate Face Check',
          detail: 'Spliced face previously logged under pseudonym Victor Belov.',
        },
      },
      tampering: {
        detectedBoxes: [
          {
            x: 6,
            y: 21,
            width: 23,
            height: 44,
            label: 'PHOTO SPLICING',
            confidence: 94,
          },
          {
            x: 77,
            y: 27,
            width: 15,
            height: 22,
            label: 'FORGED STAMP',
            confidence: 88,
          },
        ],
        confidenceBars: {
          photoReplacement: 94,
          textManipulation: 38,
          stampForgery: 88,
          metadataAnalysis: 76,
        },
        summary: 'Critical ELA variance found: Splicing boundary around photo portrait and unnatural pixel compression in consulate ink seal.',
        tamperingDetected: true,
      },
      face: {
        similarityScore: 32.1,
        livenessPassed: true,
        impersonationAlert: true,
        croppedDocFaceUrl: TAMPERED_PASSPORT_SVG,
        capturedTravelerFaceUrl: TRAVELER_IMPOSTOR_SVG,
      },
      documentImageUrl: TAMPERED_PASSPORT_SVG,
      travelerImageUrl: TRAVELER_IMPOSTOR_SVG,
    },
  },
  {
    id: 'demo-3',
    title: 'Demo 3: Modified DOB & Expired Visa',
    badge: 'REJECT / EXPIRED',
    type: 'visa',
    description: 'Modified Date of Birth font artifacts, ICAO checksum mismatch, and expired visa status.',
    expectedVerdict: 'NOT_APPROVED',
    documentImage: MODIFIED_DOB_VISA_SVG,
    travelerImage: TRAVELER_JOHNATHAN_SVG,
    mockResult: {
      id: 'VERIF-4412-ALERT',
      timestamp: new Date().toLocaleTimeString(),
      documentType: 'visa',
      verdict: 'NOT_APPROVED',
      fraudRiskScore: 89,
      failureReasons: [
        'Modified Date of Birth: Printed DOB (1998) does not match hidden MRZ (1982)',
        'ICAO 9303 Checksum Mismatch: Failed 7-3-1 check digit validation on DOB field',
        'Document Expired: Visa validity expired on 10 FEB 2024',
      ],
      executionSpeeds: {
        ocrSpeedSec: 0.15,
        validationSpeedSec: 0.07,
        elaSpeedSec: 0.21,
        faceSpeedSec: 0.17,
        totalTimeSec: 0.60,
      },
      ocr: {
        fullName: 'AL-MANSOOR, TARIQ',
        visaNumber: 'V-90281944',
        visaType: 'TYPE C / SCHENGEN',
        entryValidation: 'SINGLE ENTRY',
        stayDuration: '90 DAYS',
        issuingCountry: 'SHENG STATE (ARE POST)',
        dateOfBirth: '1998-05-12',
        dateOfExpiry: '2024-02-10',
        rawMrz: 'V<AREALMANSOOR<<TARIQ<<<<<<<<<<<<<<<<<<<<<<<\nV902819448ARE8205127M2402102<<<<<<<<<<<<<<18',
        alteredFields: ['dateOfBirth', 'dateOfExpiry'],
      },
      validation: {
        mrzChecksum: {
          passed: false,
          code: 'ICAO_CHECKSUM_FAIL',
          title: 'ICAO 9303 MRZ Check-Digit Math',
          detail: 'MISMATCH ✕: DOB check digit 7 conflicts with calculated 7-3-1 sum (expected 2).',
        },
        dobCrossCheck: {
          passed: false,
          code: 'DOB_MISMATCH_FAIL',
          title: 'Printed DOB vs. Hidden MRZ Cross-Check',
          detail: 'MODIFIED DOB DETECTED ✕: Printed text says 12 MAY 1998, but encoded MRZ says 820512 (1982).',
        },
        expirationCheck: {
          passed: false,
          code: 'DOC_EXPIRED_FAIL',
          title: 'Document Expiration Check',
          detail: 'EXPIRED DOCUMENT ✕: Visa expired on 10 FEB 2024.',
        },
        watchlistCheck: {
          passed: true,
          code: 'WATCHLIST_CLEAR',
          title: 'Offline SQLite Watchlist Lookup',
          detail: 'Clear: No active border interception flags on passport number.',
        },
        duplicateFaceCheck: {
          passed: true,
          code: 'BIOMETRIC_UNIQUE',
          title: 'Multiple Identity / Duplicate Face Check',
          detail: 'Unique template record.',
        },
      },
      tampering: {
        detectedBoxes: [
          {
            x: 32,
            y: 26,
            width: 26,
            height: 8,
            label: 'FONT CLONING',
            confidence: 89,
          },
        ],
        confidenceBars: {
          photoReplacement: 12,
          textManipulation: 91,
          stampForgery: 18,
          metadataAnalysis: 64,
        },
        summary: 'Font glyph spacing and compression gradient in the Date of Birth text box indicate digital text manipulation.',
        tamperingDetected: true,
      },
      face: {
        similarityScore: 91.4,
        livenessPassed: true,
        impersonationAlert: false,
        croppedDocFaceUrl: MODIFIED_DOB_VISA_SVG,
        capturedTravelerFaceUrl: TRAVELER_JOHNATHAN_SVG,
      },
      documentImageUrl: MODIFIED_DOB_VISA_SVG,
      travelerImageUrl: TRAVELER_JOHNATHAN_SVG,
    },
  },
];
