/**
 * ICAO 9303 MRZ Check-Digit Math (7-3-1 Weighting Algorithm)
 */

const MRZ_WEIGHTS = [7, 3, 1];

export function getMrzCharValue(char: string): number {
  if (char >= '0' && char <= '9') {
    return parseInt(char, 10);
  }
  if (char >= 'A' && char <= 'Z') {
    return char.charCodeAt(0) - 55; // 'A' = 10, 'Z' = 35
  }
  return 0; // '<' filler or spaces
}

export function calculateIcaoCheckDigit(data: string): number {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    const val = getMrzCharValue(data[i].toUpperCase());
    const weight = MRZ_WEIGHTS[i % 3];
    sum += val * weight;
  }
  return sum % 10;
}

export function verifyIcaoField(data: string, checkDigitChar: string): boolean {
  const expected = calculateIcaoCheckDigit(data);
  const actual = parseInt(checkDigitChar, 10);
  return !isNaN(actual) && expected === actual;
}

export interface ParsedPassportMrz {
  documentCode: string;
  issuingState: string;
  lastName: string;
  firstNames: string;
  passportNumber: string;
  passportNumberCheckDigit: string;
  nationality: string;
  dateOfBirthYYMMDD: string;
  dobCheckDigit: string;
  gender: string;
  expirationDateYYMMDD: string;
  expiryCheckDigit: string;
  compositeCheckDigit: string;
  isValidChecksum: boolean;
}

export function parseAndVerifyMrzTD3(line1: string, line2: string): ParsedPassportMrz | null {
  if (!line1 || !line2 || line1.length < 44 || line2.length < 44) {
    return null;
  }

  const documentCode = line1.substring(0, 2);
  const issuingState = line1.substring(2, 5).replace(/</g, '');
  const namesRaw = line1.substring(5, 44);
  const nameParts = namesRaw.split('<<');
  const lastName = (nameParts[0] || '').replace(/</g, ' ').trim();
  const firstNames = (nameParts[1] || '').replace(/</g, ' ').trim();

  const passportNumber = line2.substring(0, 9).replace(/</g, '');
  const passportNumberCheckDigit = line2.substring(9, 10);
  const nationality = line2.substring(10, 13).replace(/</g, '');
  const dateOfBirthYYMMDD = line2.substring(13, 19);
  const dobCheckDigit = line2.substring(19, 20);
  const gender = line2.substring(20, 21);
  const expirationDateYYMMDD = line2.substring(21, 27);
  const expiryCheckDigit = line2.substring(27, 28);
  const compositeCheckDigit = line2.substring(43, 44);

  const passportValid = verifyIcaoField(line2.substring(0, 9), passportNumberCheckDigit);
  const dobValid = verifyIcaoField(dateOfBirthYYMMDD, dobCheckDigit);
  const expiryValid = verifyIcaoField(expirationDateYYMMDD, expiryCheckDigit);

  return {
    documentCode,
    issuingState,
    lastName,
    firstNames,
    passportNumber,
    passportNumberCheckDigit,
    nationality,
    dateOfBirthYYMMDD,
    dobCheckDigit,
    gender,
    expirationDateYYMMDD,
    expiryCheckDigit,
    compositeCheckDigit,
    isValidChecksum: passportValid && dobValid && expiryValid,
  };
}
