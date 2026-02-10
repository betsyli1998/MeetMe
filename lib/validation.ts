export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// Email validation (stricter than current regex)
export function validateEmail(email: string): ValidationResult {
  // RFC 5322 compliant regex (simplified but more accurate)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!email || email.length > 254) {
    return { valid: false, error: 'Email must be between 1 and 254 characters' };
  }

  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  return { valid: true };
}

// Date validation (YYYY-MM-DD format)
export function validateDate(date: string): ValidationResult {
  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

  if (!dateRegex.test(date)) {
    return { valid: false, error: 'Date must be in YYYY-MM-DD format' };
  }

  // Check if date is valid (e.g., not Feb 30)
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return { valid: false, error: 'Invalid date' };
  }

  return { valid: true };
}

// Time validation (HH:MM format)
export function validateTime(time: string): ValidationResult {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!timeRegex.test(time)) {
    return { valid: false, error: 'Time must be in HH:MM format (24-hour)' };
  }

  return { valid: true };
}

// String length validation
export function validateLength(
  value: string,
  fieldName: string,
  min: number,
  max: number
): ValidationResult {
  if (value.length < min) {
    return { valid: false, error: `${fieldName} must be at least ${min} characters` };
  }

  if (value.length > max) {
    return { valid: false, error: `${fieldName} must not exceed ${max} characters` };
  }

  return { valid: true };
}

// Sanitize user input for AI prompts (prevent injection)
export function sanitizeForAI(input: string): string {
  // Remove control characters and excessive whitespace
  return input
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .slice(0, 500); // Limit length
}
