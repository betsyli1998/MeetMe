import { cookies } from 'next/headers';
import { Session } from '@/types';

const SESSION_COOKIE_NAME = 'meetme_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Generate a new session ID
 * Uses crypto.randomUUID() for secure random IDs
 */
export function generateSessionId(): string {
  return crypto.randomUUID();
}

/**
 * Get the current session ID from cookies
 * Returns null if no session exists
 */
export async function getSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  return sessionCookie?.value || null;
}

/**
 * Get or create a session ID
 * If no session exists, creates a new one and sets the cookie
 */
export async function getOrCreateSessionId(): Promise<string> {
  let sessionId = await getSessionId();

  if (!sessionId) {
    sessionId = generateSessionId();
    await setSessionCookie(sessionId);
  }

  return sessionId;
}

/**
 * Set the session cookie
 * Cookie is httpOnly for security, expires after 7 days
 */
export async function setSessionCookie(sessionId: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // Stronger CSRF protection
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

/**
 * Create a new session object
 */
export function createSession(sessionId: string): Session {
  return {
    id: sessionId,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Clear the session cookie
 * Used for testing or if user wants to reset
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
