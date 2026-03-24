import 'server-only';
import { cookies } from 'next/headers';

export const COOKIE_NAME = 'f28-admin-session';
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

async function getSigningKey(): Promise<CryptoKey> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error('ADMIN_PASSWORD is not set');
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function createAdminToken(): Promise<string> {
  const nonce = crypto.randomUUID();
  const expiry = Date.now() + COOKIE_MAX_AGE * 1000;
  const payload = `${nonce}:${expiry}`;
  const key = await getSigningKey();
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return `${btoa(payload)}.${btoa(String.fromCharCode(...new Uint8Array(sig)))}`;
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const dot = token.lastIndexOf('.');
    if (dot === -1) return false;
    const payloadB64 = token.slice(0, dot);
    const sigB64 = token.slice(dot + 1);
    const payload = atob(payloadB64);
    const expiry = parseInt(payload.split(':')[1], 10);
    if (!expiry || Date.now() > expiry) return false;
    const key = await getSigningKey();
    const sig = Uint8Array.from(atob(sigB64), c => c.charCodeAt(0));
    return await crypto.subtle.verify('HMAC', key, sig, new TextEncoder().encode(payload));
  } catch {
    return false;
  }
}

export async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}
