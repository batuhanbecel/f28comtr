import { requireAdminSession } from '@/lib/auth';
import { SiteSettingsClient } from '@/components/admin/SiteSettingsClient';
import { isRedisConfigured } from '@/lib/db';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { getAdminT } from '@/lib/getAdminT';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  await requireAdminSession();

  const a = await getAdminT();
  const redisOk = isRedisConfigured();
  const blobOk = !!process.env.BLOB_READ_WRITE_TOKEN;

  const envRows = [
    {
      label: a.settings.redis,
      status: redisOk ? a.status.connected : a.status.notConfigured,
      ok: redisOk,
    },
    { label: a.settings.nodeEnv, status: process.env.NODE_ENV ?? 'development', ok: true },
    {
      label: a.settings.vercelBlob,
      status: blobOk ? a.status.connected : a.status.notConfigured,
      ok: blobOk,
    },
  ];

  const externalLinks = [
    { label: a.settings.vercelDashboard, href: 'https://vercel.com/dashboard' },
    { label: a.settings.upstashConsole, href: 'https://console.upstash.com' },
    { label: a.settings.viewLiveSite, href: '/' },
  ];

  return (
    <AdminPageLayout
      title={a.settings.title}
      breadcrumb={{ href: '/admin', label: a.nav.dashboard }}
      maxWidth="4xl"
    >
      <p className="admin-muted text-xs mb-8">{a.settings.intro}</p>

      <AdminPanel label={a.settings.environment} title={a.settings.status} className="mb-8">
        <div className="divide-y divide-th-fg/[0.05] border border-th-fg/[0.07]">
          {envRows.map((row) => (
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

      <AdminPanel label={a.settings.external} title={a.settings.links} className="mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {externalLinks.map((link) => (
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
