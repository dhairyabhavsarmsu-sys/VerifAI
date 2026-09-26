export type DocumentType = 
  | 'passport' 
  | 'visa' 
  | 'national_id' 
  | 'driving_license' 
  | 'permit';

export interface BoundingBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
  label: string;
  confidence: number;
}

export interface OCRResult {
  // Common / Passport / ID fields
  fullName?: string;
  documentNumber?: string;
  nationality?: string;
  dateOfBirth?: string;
  dateOfExpiry?: string;
  gender?: string;
  rawMrz?: string; // 2 lines
  
  // Visa / Permit specific fields
  visaNumber?: string;
  visaType?: string;
  entryValidation?: string;
  stayDuration?: string;
  issuingCountry?: string;

  // Flagged/Altered field names
  alteredFields: string[];
}

export interface ValidationRuleResult {
  passed: boolean;
  code: string;
  title: string;
  detail: string;
}

export interface DocumentValidationResult {
  mrzChecksum: ValidationRuleResult; // ICAO 9303 7-3-1
  dobCrossCheck: ValidationRuleResult; // Printed DOB vs MRZ DOB
  expirationCheck: ValidationRuleResult; // Document validity
  watchlistCheck: ValidationRuleResult; // Offline SQLite blacklist lookup
  duplicateFaceCheck: ValidationRuleResult; // Multiple identity detection
}

export interface TamperingConfidenceBars {
  photoReplacement: number; // 0-100%
  textManipulation: number; // 0-100%
  stampForgery: number;     // 0-100%
  metadataAnalysis: number; // 0-100%
}

export interface TamperingResult {
  elaImageBase64?: string;
  detectedBoxes: BoundingBox[];
  confidenceBars: TamperingConfidenceBars;
  summary: string;
  tamperingDetected: boolean;
}

export interface FaceVerificationResult {
  similarityScore: number; // 0-100% (128-d cosine similarity)
  livenessPassed: boolean;
  impersonationAlert: boolean;
  croppedDocFaceUrl?: string;
  capturedTravelerFaceUrl?: string;
}

export interface ModuleExecutionSpeeds {
  ocrSpeedSec: number;
  validationSpeedSec: number;
  elaSpeedSec: number;
  faceSpeedSec: number;
  totalTimeSec: number;
}

export interface VerificationResult {
  id: string;
  timestamp: string;
  documentType: DocumentType;
  verdict: 'APPROVED' | 'NOT_APPROVED';
  fraudRiskScore: number; // 0 - 100%
  failureReasons: string[];
  executionSpeeds: ModuleExecutionSpeeds;
  
  // 4 Core Modules
  ocr: OCRResult;
  validation: DocumentValidationResult;
  tampering: TamperingResult;
  face: FaceVerificationResult;

  // Input previews
  documentImageUrl: string;
  travelerImageUrl: string;
}

export interface CheckpointLogItem {
  id: string;
  timestamp: string;
  documentType: DocumentType;
  passengerName: string;
  documentNumber: string;
  riskScore: number;
  verdict: 'APPROVED' | 'NOT_APPROVED';
  moduleAlerts: string[];
  inspectionNotes?: string;
}

export interface DemoPreset {
  id: string;
  title: string;
  badge: string;
  type: DocumentType;
  description: string;
  expectedVerdict: 'APPROVED' | 'NOT_APPROVED';
  documentImage: string;
  travelerImage: string;
  mockResult: VerificationResult;
}
