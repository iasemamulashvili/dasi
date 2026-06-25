import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

if (
  process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PHASE !== 'phase-production-build' &&
  !process.env.ADMIN_JWT_SECRET
) {
  throw new Error(
    'CRITICAL SECURITY CONFIGURATION ERROR: The ADMIN_JWT_SECRET environment variable is not defined! ' +
    'To prevent session hijacking exploits, the application cannot run in production without a secure, ' +
    'unique ADMIN_JWT_SECRET configured in the environment.'
  );
}

const SECRET_KEY = process.env.ADMIN_JWT_SECRET || 'fallback-secret-dasi-games-redesign-2026';
const encodedSecret = new TextEncoder().encode(SECRET_KEY);

export async function createSession(username: string) {
  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(encodedSecret);
  
  // Set in cookie
  const cookieStore = await cookies();
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 2, // 2 hours
    path: '/',
  });

  return token;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload as { username: string };
  } catch (e) {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}
