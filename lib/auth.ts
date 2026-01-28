import { Session } from '@/types';
import { getStorage } from './storage';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'meetme_session';

// Simple session management (in production, use secure JWT or sessions)
export async function createSession(email: string, password: string): Promise<Session | null> {
  const storage = getStorage();
  const user = storage.getUserByEmail(email);

  if (!user || user.password !== password) {
    return null;
  }

  const session: Session = {
    userId: user.id,
    email: user.email,
    name: user.name,
  };

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return session;
}

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie) {
      return null;
    }

    const session: Session = JSON.parse(sessionCookie.value);
    return session;
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAuth(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}
