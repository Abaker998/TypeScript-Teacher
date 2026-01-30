import { NextRequest, NextResponse } from 'next/server';
import { validateUser } from '@/lib/storage';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const passwordHash = Buffer.from(password).toString('base64');

    if (!validateUser(username, passwordHash)) {
      return NextResponse.json(
        { error: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    // Set a session cookie (valid for 30 days)
    const sessionData = JSON.stringify({ username });
    const cookieStore = await cookies();
    cookieStore.set('ts-teacher-session', sessionData, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return NextResponse.json({ success: true, user: { username } });
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { error: 'An error occurred during signin.' },
      { status: 500 }
    );
  }
}
