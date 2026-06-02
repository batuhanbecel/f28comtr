import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPhotographers, getAiPoweredImages, isRedisConfigured } from '@/lib/db';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { getAdminT } from '@/lib/getAdminT';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('f28-admin-session');
  if (!sessionCookie?.value) redirect('/admin/login');

  const a = await getAdminT();

  const [photographers, aiPoweredImages] = await Promise.all([
    getPhotographers(),
    getAiPoweredImages(),
  ]);

  const stats = [
    { label: a.dashboard.stats.photographers, value: photographers.length, href: '/admin/photographers' },
    { label: a.dashboard.stats.aiPowered, value: aiPoweredImages.length, href: '/admin/ai-powered' },
    {
      label: a.dashboard.stats.redis,
      value: isRedisConfigured() ? a.status.connected : a.status.none,
      href: '/admin/settings',
    },
    { label: a.dashboard.stats.viewSite, value: '↗', href: '/', target: '_blank' },
  ];

  const quickLinks = [
    {
      href: '/admin/photographers',
      label: a.nav.photographers,
      desc: a.dashboard.cards.photographersDesc,
      icon: '👥',
    },
    { href: '/admin/ai-powered', label: a.nav.aiPowered, desc: a.dashboard.cards.aiPoweredDesc, icon: '⚡' },
    { href: '/admin/settings', label: a.nav.settings, desc: a.dashboard.cards.settingsDesc, icon: '⚙' },
  ];

  return (
    <AdminPageLayout title={a.dashboard.title}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px border border-th-fg/[0.06] bg-th-fg/[0.03] mb-14">
        {stats.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            target={s.target as '_blank' | undefined}
            className="bg-th-bg px-6 py-5 group hover:bg-th-fg/[0.03] transition-colors block"
          >
            <p className="admin-muted text-[9px] tracking-[0.45em] uppercase mb-2">{s.label}</p>
            <p className="text-3xl font-black tracking-tighter group-hover:text-th-fg/70 transition-colors">
              {s.value}
            </p>
          </Link>
        ))}
      </div>

      <AdminPanel
        label={a.dashboard.roster}
        title={a.dashboard.photographers}
        actions={
          <Link href="/admin/photographers" className="btn-editorial text-[10px]">
            {a.actions.manageAll}
          </Link>
        }
      >
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2">
          {photographers.slice(0, 7).map((p) => (
            <Link
              key={p.id}
              href={`/admin/photographers/${p.id}`}
              className="group relative aspect-[3/4] overflow-hidden bg-th-fg/[0.03] border border-th-fg/[0.05] hover:border-th-fg/20 transition-all duration-300"
            >
              <Image
                src={p.preview}
                alt={p.fullName}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="15vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-th-bg/90 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <p className="text-th-fg text-[9px] font-bold tracking-tight truncate">
                  {p.fullName.split(' ')[0]}
                </p>
              </div>
            </Link>
          ))}
          {photographers.length > 7 && (
            <Link
              href="/admin/photographers"
              className="aspect-[3/4] border border-th-fg/[0.05] hover:border-th-fg/20 flex items-center justify-center text-th-fg/30 hover:text-th-fg text-[9px] tracking-[0.3em] uppercase transition-colors"
            >
              +{photographers.length - 7}
            </Link>
          )}
        </div>
      </AdminPanel>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-th-fg/[0.05] bg-th-fg/[0.02] mt-10">
        {quickLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-th-bg p-6 hover:bg-th-fg/[0.03] transition-colors group"
          >
            <div className="text-2xl mb-3">{item.icon}</div>
            <h3 className="font-bold text-sm mb-1 group-hover:text-th-fg/80 transition-colors">{item.label}</h3>
            <p className="text-[11px] text-th-fg/30">{item.desc}</p>
          </Link>
        ))}
      </div>
    </AdminPageLayout>
  );
}
