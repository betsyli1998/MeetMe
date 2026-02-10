import { NextResponse } from 'next/server';

export function validateOrigin(request: Request): { valid: boolean; error?: string } {
  // Only validate state-changing methods
  const method = request.method;
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return { valid: true };
  }

  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host');

  // Get expected origin from environment
  const expectedOrigin = process.env.NEXT_PUBLIC_APP_URL || `http://${host}`;
  const expectedHost = new URL(expectedOrigin).host;

  // Check Origin header (preferred)
  if (origin) {
    const originHost = new URL(origin).host;
    if (originHost !== expectedHost) {
      return {
        valid: false,
        error: `Invalid origin: ${origin}`,
      };
    }
    return { valid: true };
  }

  // Fallback to Referer header
  if (referer) {
    const refererHost = new URL(referer).host;
    if (refererHost !== expectedHost) {
      return {
        valid: false,
        error: `Invalid referer: ${referer}`,
      };
    }
    return { valid: true };
  }

  // No Origin or Referer header (suspicious)
  return {
    valid: false,
    error: 'Missing Origin and Referer headers',
  };
}
