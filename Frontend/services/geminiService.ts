import { VerificationResult } from '../types';

export interface GuardAIFeedback {
  guidanceSummary: string;
  recommendedAction: string;
  protocolSteps: string[];
  interrogationQuestions: string[];
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

/**
 * Generates real-time, actionable frontline guidance for the border security officer.
 * Uses local FastAPI backend (http://localhost:8000/api/guidance) or instant forensic heuristics fallback.
 */
export async function generateGuardGuidance(result: VerificationResult): Promise<GuardAIFeedback> {
  // If result is APPROVED
  if (result.verdict === 'APPROVED') {
    return {
      threatLevel: 'LOW',
      guidanceSummary:
        'All primary biometric and cryptographic checks are verified. Document features match ICAO standards.',
      recommendedAction: 'EXPEDITE PASSENGER CLEARANCE — STAMP ENTRY VISA',
      protocolSteps: [
        '1. Inspect physical travel document for physical microprint and tactile intaglio ink.',
        '2. Confirm intended stay duration and port of entry declaration.',
        '3. Apply standard entry stamp and return documents to traveler.',
      ],
      interrogationQuestions: [
        'What is the primary purpose and duration of your travel?',
        'Can you confirm your current residential address?',
      ],
    };
  }

  // Attempt local FastAPI guidance endpoint
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch('http://localhost:8000/api/guidance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.warn('Local FastAPI guidance fallback to local heuristic rule engine:', err);
  }

  // Robust domain-grounded tactical heuristic fallback:
  const isSplicing = result.tampering?.confidenceBars?.photoReplacement > 50;
  const isDobMismatch = !result.validation?.dobCrossCheck?.passed;
  const isStampForgery = result.tampering?.confidenceBars?.stampForgery > 50;
  const isFaceMismatch = result.face?.impersonationAlert;
  const isExpired = !result.validation?.expirationCheck?.passed;

  if (isSplicing || isFaceMismatch) {
    return {
      threatLevel: 'HIGH',
      guidanceSummary: `Critical biometric fraud: ELA Heatmap identified artificial pixel variance in the portrait frame (${result.tampering.confidenceBars.photoReplacement}% splicing confidence) alongside an impersonation alert (${result.face.similarityScore}% live face match).`,
      recommendedAction: 'HOLD TRAVELER AT COUNTER & ALERT SECONDARY TACTICAL ESCORT',
      protocolSteps: [
        '1. Maintain possession of the passport; do not return it to traveler.',
        '2. Activate silent secondary assistance beacon on counter console.',
        '3. Inspect document with 365nm UV forensic lamp to detect adhesive bleed or mechanical razor slicing around portrait.',
      ],
      interrogationQuestions: [
        'When and at which consular office was this passport issued?',
        'Can you produce supporting secondary government identification (driver license, birth certificate, credit card)?',
      ],
    };
  }

  if (isDobMismatch || isStampForgery) {
    return {
      threatLevel: 'HIGH',
      guidanceSummary: `Forged travel credentials: The visual printed Date of Birth has been digitally altered and contradicts the cryptographic MRZ machine-readable checksum. Stamp ink compression also exhibits synthetic digital cloning.`,
      recommendedAction: 'REFUSE ADMISSION — INITIATE FRAUDULENT DOCUMENT DOCKET',
      protocolSteps: [
        '1. Place document in transparent evidence sleeve.',
        '2. Log document serial number in the Regional Anti-Fraud Registry.',
        '3. Issue Form I-275 (Withdrawal of Application for Admission) pending formal supervisor sign-off.',
      ],
      interrogationQuestions: [
        'State your exact date and city of birth without consulting your papers.',
        'Who arranged this visa issuance and where did you submit your biometric application?',
      ],
    };
  }

  return {
    threatLevel: isExpired ? 'MEDIUM' : 'HIGH',
    guidanceSummary: `Screening rejected due to compliance failure: ${result.failureReasons[0] || 'Unverified credential attributes'}.`,
    recommendedAction: 'REDIRECT TO IMMIGRATION ADJUDICATION DESK',
    protocolSteps: [
      '1. Verify visa extension history on border mainframe.',
      '2. Query airline liaison officer regarding boarding clearance.',
      '3. Retain passenger for formal supervisor interview.',
    ],
    interrogationQuestions: [
      'Are you aware of the expiration date stamped on this entry endorsement?',
      'Do you hold an active visa extension or waiver letter from the Ministry?',
    ],
  };
}
