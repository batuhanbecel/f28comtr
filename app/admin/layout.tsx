import type { Metadata } from 'next';
import { AdminShell } from '@/components/admin/AdminShell';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Admin Panel — f/2.8 Production',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-th-bg text-th-fg">
      <AdminShell>{children}</AdminShell>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgb(var(--c-fg) / 0.08)',
            color: 'var(--foreground)',
            border: '1px solid rgb(var(--c-fg) / 0.06)',
            backdropFilter: 'blur(12px)',
            fontSize: '13px',
            letterSpacing: '0.02em',
          },
        }}
      />
    </div>
  );
}
