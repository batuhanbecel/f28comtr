import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SiteSettingsClient } from '@/components/admin/SiteSettingsClient';
import { isRedisConfigured } from '@/lib/db';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { AdminPanel } from '@/components/admin/AdminPanel';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get('f28-admin-session')?.value) redirect('/admin/login');

  const redisOk = isRedisConfigured();

  return (
    <AdminPageLayout
      title="Settings"
      breadcrumb={{ href: '/admin', label: 'Dashboard' }}
      maxWidth="4xl"
    >
      <p className="text-th-fg/25 text-xs mb-8">Data management and system configuration</p>

      <AdminPanel label="Environment" title="Status" className="mb-8">
        <div className="divide-y divide-th-fg/[0.05] border border-th-fg/[0.07]">
          {[
            { label: 'Redis / Upstash', status: redisOk ? 'Connected' : 'Not configured', ok: redisOk },
            { label: 'Node Env', status: process.env.NODE_ENV ?? 'development', ok: true },
            { label: 'Vercel Blob', status: process.env.BLOB_READ_WRITE_TOKEN ? 'Configured' : 'Not configured', ok: !!process.env.BLOB_READ_WRITE_TOKEN },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between px-5 py-3.5 bg-th-fg/[0.02]">
              <span className="text-th-fg/40 text-sm">{row.label}</span>
              <span className={`text-xs font-mono tracking-wide ${row.ok ? 'text-green-400/80' : 'text-yellow-400/70'}`}>
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </AdminPanel>

      <SiteSettingsClient />

      <AdminPanel label="External" title="Links" className="mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Vercel Dashboard', href: 'https://vercel.com/dashboard' },
            { label: 'Upstash Console', href: 'https://console.upstash.com' },
            { label: 'View Live Site', href: '/' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 border border-th-fg/[0.07] hover:border-th-fg/20 bg-th-fg/[0.02] hover:bg-th-fg/[0.04] transition-colors text-sm text-th-fg/50 hover:text-th-fg/80"
            >
              {link.label}
              <span className="text-th-fg/20 text-xs">↗</span>
            </a>
          ))}
        </div>
      </AdminPanel>
    </AdminPageLayout>
  );
}
