'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { AdminNav } from './AdminNav';

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  return (
    <>
      <AdminNav />
      <main className="lg:pl-64">{children}</main>
    </>
  );
}
