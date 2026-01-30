import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('ts-teacher-session');

    if (!sessionCookie) {
      return NextResponse.json({ user: null });
    }

    try {
      const session = JSON.parse(sessionCookie.value);
      return NextResponse.json({ user: { username: session.username } });
    } catch {
      return NextResponse.json({ user: null });
    }
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ user: null });
  }
}
