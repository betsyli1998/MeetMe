import { createSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return NextResponse.redirect(new URL('/?error=missing-credentials', request.url));
    }

    const session = await createSession(email, password);

    if (!session) {
      return NextResponse.redirect(new URL('/?error=invalid-credentials', request.url));
    }

    return NextResponse.redirect(new URL('/create', request.url));
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.redirect(new URL('/?error=server-error', request.url));
  }
}
