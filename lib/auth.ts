import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  COOKIE_MAX_AGE,
  COOKIE_NAME,
  createAdminToken,
  verifyAdminToken,
} from '@/lib/authToken';

export { COOKIE_MAX_AGE, COOKIE_NAME, createAdminToken, verifyAdminToken };

export async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

/** Server Components — redirect when session missing or invalid. */
export async function requireAdminSession(): Promise<void> {
  if (!(await checkAuth())) {
    redirect('/admin/login');
  }
}
