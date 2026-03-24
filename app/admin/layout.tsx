import type { Metadata } from 'next';
import { AdminNav } from '@/components/admin/AdminNav';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Admin Panel — f/2.8 Production',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <AdminNav />
      <main className="lg:pl-64">
        {children}
      </main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(255,255,255,0.08)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
            fontSize: '13px',
            letterSpacing: '0.02em',
          },
        }}
      />
    </div>
  );
}
