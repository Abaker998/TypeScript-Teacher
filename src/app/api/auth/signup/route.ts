import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUser } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters.' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    if (getUser(username)) {
      return NextResponse.json(
        { error: 'This username is already taken.' },
        { status: 400 }
      );
    }

    // Simple hash (not secure for production, but fine for local demo)
    const passwordHash = Buffer.from(password).toString('base64');
    createUser(username, passwordHash);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An error occurred during signup.' },
      { status: 500 }
    );
  }
}
