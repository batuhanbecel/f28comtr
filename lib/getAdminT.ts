import { cookies } from 'next/headers';
import { parseLang } from '@/lib/prefs';
import { translations } from '@/lib/translations';

export async function getAdminT() {
  const cookieStore = await cookies();
  const lang = parseLang(cookieStore.get('f28_lang')?.value);
  return translations[lang].admin;
}
