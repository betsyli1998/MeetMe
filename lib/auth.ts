import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'meetme_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Mock user database
const MOCK_USERS = [
  {
    email: 'demo@meetme.com',
    password: 'password123', // In production, this would be hashed
    id: 'user-demo-001',
  },
];

/**
 * Create a session for a user
 * This is a mock implementation for the prototype
 */
export async function createSession(
  email: string,
  password: string
): Promise<{ userId: string; email: string } | null> {
  // Find user with matching credentials
  const user = MOCK_USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return null;
  }

  // Create session token
  const sessionId = crypto.randomUUID();
  const sessionData = {
    userId: user.id,
    email: user.email,
  };

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });

  return sessionData;
}

/**
 * Get the current session
 */
export async function getSession(): Promise<{
  userId: string;
  email: string;
} | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    return JSON.parse(sessionCookie.value);
  } catch {
    return null;
  }
}

/**
 * Destroy the current session
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}
