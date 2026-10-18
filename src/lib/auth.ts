import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

const AUTH_COOKIE = 'viefood_session';

export interface SessionUser {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  role: 'CUSTOMER' | 'ADMIN' | 'STAFF' | string;
}

export function encodeSession(user: SessionUser): string {
  const payload = JSON.stringify({
    ...user,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return Buffer.from(payload).toString('base64');
}

export function decodeSession(token: string): SessionUser | null {
  try {
    const raw = Buffer.from(token, 'base64').toString('utf-8');
    const data = JSON.parse(raw);
    if (data.exp && Date.now() > data.exp) {
      return null;
    }
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
    };
  } catch {
    return null;
  }
}

export async function getServerSession(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return decodeSession(token);
}

export { AUTH_COOKIE };

