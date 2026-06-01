'use client';

import { useLanguage } from '@/context/LanguageContext';

export function useAdminT() {
  return useLanguage().t.admin;
}
