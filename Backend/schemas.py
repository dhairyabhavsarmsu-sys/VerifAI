from pydantic import BaseModel, Field
from typing import List, Optional, Literal

DocumentType = Literal['passport', 'visa', 'national_id', 'driving_license', 'permit']
VerdictType = Literal['APPROVED', 'NOT_APPROVED']

class BoundingBox(BaseModel):
    x: float
    y: float
    width: float
    height: float
    label: str
    confidence: float

class OCRResult(BaseModel):
    fullName: Optional[str] = None
    documentNumber: Optional[str] = None
    nationality: Optional[str] = None
    dateOfBirth: Optional[str] = None
    dateOfExpiry: Optional[str] = None
    gender: Optional[str] = None
    rawMrz: Optional[str] = None
    
    # Visa / Permit fields
    visaNumber: Optional[str] = None
    visaType: Optional[str] = None
    entryValidation: Optional[str] = None
    stayDuration: Optional[str] = None
    issuingCountry: Optional[str] = None
    
    alteredFields: List[str] = Field(default_factory=list)

class ValidationRuleResult(BaseModel):
    passed: bool
    code: str
    title: str
    detail: str

class DocumentValidationResult(BaseModel):
    mrzChecksum: ValidationRuleResult
    dobCrossCheck: ValidationRuleResult
    expirationCheck: ValidationRuleResult
    watchlistCheck: ValidationRuleResult
    duplicateFaceCheck: ValidationRuleResult

class TamperingConfidenceBars(BaseModel):
    photoReplacement: float
    textManipulation: float
    stampForgery: float
    metadataAnalysis: float

class TamperingResult(BaseModel):
    elaImageBase64: Optional[str] = None
    detectedBoxes: List[BoundingBox] = Field(default_factory=list)
    confidenceBars: TamperingConfidenceBars
    summary: str
    tamperingDetected: bool

class FaceVerificationResult(BaseModel):
    similarityScore: float
    livenessPassed: bool
    impersonationAlert: bool
    croppedDocFaceUrl: Optional[str] = None
    capturedTravelerFaceUrl: Optional[str] = None

class ModuleExecutionSpeeds(BaseModel):
    ocrSpeedSec: float
    validationSpeedSec: float
    elaSpeedSec: float
    faceSpeedSec: float
    totalTimeSec: float

class VerificationResult(BaseModel):
    id: str
    timestamp: str
    documentType: DocumentType
    verdict: VerdictType
    fraudRiskScore: float
    failureReasons: List[str] = Field(default_factory=list)
    executionSpeeds: ModuleExecutionSpeeds
    ocr: OCRResult
    validation: DocumentValidationResult
    tampering: TamperingResult
    face: FaceVerificationResult
    documentImageUrl: str
    travelerImageUrl: str

class GuardAIFeedback(BaseModel):
    guidanceSummary: str
    recommendedAction: str
    protocolSteps: List[str]
    interrogationQuestions: List[str]
    threatLevel: Literal['LOW', 'MEDIUM', 'HIGH']

class CheckpointLogItem(BaseModel):
    id: str
    timestamp: str
    documentType: DocumentType
    passengerName: str
    documentNumber: str
    riskScore: float
    verdict: VerdictType
    moduleAlerts: List[str]
    inspectionNotes: Optional[str] = None
