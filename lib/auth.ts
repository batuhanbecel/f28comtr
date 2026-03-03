export const COOKIE_NAME = 'f28-admin-session';
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function createAdminToken(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error('ADMIN_PASSWORD environment variable is not set');

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode('f28-admin-v1')
  );

  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const expected = await createAdminToken();
    return token === expected;
  } catch {
    return false;
  }
}
