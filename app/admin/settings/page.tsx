import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { SiteSettingsClient } from '@/components/admin/SiteSettingsClient';
import { isRedisConfigured } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get('f28-admin-session')?.value) redirect('/admin/login');

  const redisOk = isRedisConfigured();

  return (
    <div className="min-h-screen">
      <header className="border-b border-th-fg/[0.06] px-8 py-5 flex items-center justify-between sticky top-0 bg-th-surface/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-th-fg/25 text-[10px] tracking-[0.3em] uppercase hover:text-th-fg/60 transition-colors">
            ← Dashboard
          </Link>
          <div className="w-px h-3 bg-th-fg/10" />
          <span className="text-th-fg/25 text-[10px] tracking-[0.3em] uppercase">Settings</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-8 py-10">
        <div className="mb-10">
          <p className="text-th-fg/20 text-[10px] tracking-[0.5em] uppercase mb-2">Admin / Settings</p>
          <h1 className="text-3xl font-black tracking-tighter">SETTINGS</h1>
          <p className="text-th-fg/25 text-xs mt-1">Data management and system configuration</p>
        </div>

        {/* Environment status */}
        <section className="mb-8">
          <p className="text-[10px] tracking-[0.4em] uppercase text-th-fg/20 mb-4">Environment</p>
          <div className="border border-th-fg/[0.07] bg-th-fg/[0.02] divide-y divide-th-fg/[0.05]">
            {[
              { label: 'Redis / Upstash', status: redisOk ? 'Connected' : 'Not configured', ok: redisOk },
              { label: 'Node Env', status: process.env.NODE_ENV ?? 'development', ok: true },
              { label: 'Vercel Blob', status: process.env.BLOB_READ_WRITE_TOKEN ? 'Configured' : 'Not configured', ok: !!process.env.BLOB_READ_WRITE_TOKEN },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between px-5 py-3.5">
                <span className="text-th-fg/40 text-sm">{row.label}</span>
                <span className={`text-xs font-mono tracking-wide ${row.ok ? 'text-green-400/80' : 'text-yellow-400/70'}`}>{row.status}</span>
              </div>
            ))}
          </div>
        </section>

        <SiteSettingsClient />

        {/* External links */}
        <section className="mt-8">
          <p className="text-[10px] tracking-[0.4em] uppercase text-th-fg/20 mb-4">External</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Vercel Dashboard', href: 'https://vercel.com/dashboard' },
              { label: 'Upstash Console', href: 'https://console.upstash.com' },
              { label: 'View Live Site', href: '/' },
            ].map(link => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 border border-th-fg/[0.07] hover:border-th-fg/20 bg-th-fg/[0.02] hover:bg-th-fg/[0.04] transition-colors text-sm text-th-fg/50 hover:text-th-fg/80">
                {link.label}
                <span className="text-th-fg/20 text-xs">↗</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
