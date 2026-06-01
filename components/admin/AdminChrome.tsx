'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export function AdminChrome() {
  return (
    <div className="flex items-center gap-3">
      <LanguageSwitcher />
      <span className="w-px h-3 bg-th-fg/15" aria-hidden="true" />
      <ThemeToggle />
    </div>
  );
}