import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPhotographers, getAIImages, isRedisConfigured } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('f28-admin-session');
  if (!sessionCookie?.value) redirect('/admin/login');

  const [photographers, aiImages] = await Promise.all([
    getPhotographers(),
    getAIImages(),
  ]);

  const stats = [
    { label: 'Photographers', value: photographers.length, href: '/admin/photographers' },
    { label: 'AI Images', value: aiImages.length, href: '/admin/ai-based' },
    { label: 'Redis', value: isRedisConfigured() ? 'Connected' : 'None', href: '/admin/settings' },
    { label: 'View Site', value: '↗', href: '/', target: '_blank' },
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/[0.06] px-8 py-5 flex items-center justify-between sticky top-0 bg-[#080808]/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <Image src="/logos/f28/f28_white.png" alt="f/2.8" width={80} height={40} className="h-7 w-auto opacity-60" />
          <div className="w-px h-4 bg-white/10" />
          <span className="text-white/25 text-[10px] tracking-[0.4em] uppercase">Dashboard</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-12">

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px border border-white/[0.06] bg-white/[0.03] mb-14">
          {stats.map((s) => (
            <Link key={s.label} href={s.href} target={s.target as '_blank' | undefined}
              className="bg-black px-6 py-5 group hover:bg-white/[0.03] transition-colors">
              <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-2">{s.label}</p>
              <p className="text-3xl font-black tracking-tighter group-hover:text-white/70 transition-colors">{s.value}</p>
            </Link>
          ))}
        </div>

        {/* Photographer previews */}
        <div className="mb-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-white/20 text-[10px] tracking-[0.5em] uppercase mb-2">Roster</p>
              <h2 className="text-2xl font-black tracking-tighter">PHOTOGRAPHERS</h2>
            </div>
            <Link href="/admin/photographers"
              className="text-[10px] tracking-[0.3em] uppercase text-white/40 hover:text-white transition-colors border border-white/[0.07] hover:border-white/25 px-4 py-2.5 rounded">
              Manage All →
            </Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2">
            {photographers.slice(0, 7).map((p) => (
              <Link key={p.id} href={`/admin/photographers/${p.id}`}
                className="group relative aspect-[3/4] overflow-hidden bg-white/[0.03] border border-white/[0.05] hover:border-white/20 transition-all duration-300 rounded">
                <Image src={p.preview} alt={p.fullName} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="15vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-white text-[9px] font-bold tracking-tight truncate">{p.fullName.split(' ')[0]}</p>
                </div>
              </Link>
            ))}
            {photographers.length > 7 && (
              <Link href="/admin/photographers"
                className="aspect-[3/4] border border-white/[0.05] hover:border-white/20 flex items-center justify-center text-white/30 hover:text-white text-[9px] tracking-[0.3em] uppercase transition-colors rounded">
                +{photographers.length - 7}
              </Link>
            )}
          </div>
        </div>

        {/* Quick nav */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-white/[0.05] bg-white/[0.02] mt-10">
          {[
            { href: '/admin/photographers', label: 'Photographers', desc: 'Edit roster, reorder, manage previews', icon: '👥' },
            { href: '/admin/ai-based', label: 'AI Images', desc: 'Reorder and manage AI-generated images', icon: '⚡' },
            { href: '/admin/settings', label: 'Settings', desc: 'Seed data, cache control, environment', icon: '⚙' },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className="bg-black p-6 hover:bg-white/[0.03] transition-colors group">
              <div className="text-2xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-sm mb-1 group-hover:text-white/80 transition-colors">{item.label}</h3>
              <p className="text-[11px] text-white/30">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
