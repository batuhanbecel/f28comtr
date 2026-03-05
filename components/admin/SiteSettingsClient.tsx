'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export function SiteSettingsClient() {
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);
  const router = useRouter();

  const handleSeed = async () => {
    if (!confirm('Seed from filesystem? Preserves your custom ordering.')) return;
    setSeeding(true);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Seeded — ${data.newImages ?? 0} new images added`);
        router.refresh();
      } else {
        toast.error(data.error || 'Seed failed');
      }
    } catch { toast.error('Seed failed'); }
    finally { setSeeding(false); }
  };

  const handleClearCache = async () => {
    if (!confirm('Clear Redis cache? Data will reload from filesystem on next request.')) return;
    setClearing(true);
    try {
      const res = await fetch('/api/admin/cache', { method: 'DELETE' });
      if (res.ok) { toast.success('Cache cleared'); router.refresh(); }
      else toast.error('Failed to clear cache');
    } catch { toast.error('Failed to clear cache'); }
    finally { setClearing(false); }
  };

  const actions = [
    {
      label: 'Seed from Files',
      desc: 'Import new images from filesystem. Preserves your custom image ordering.',
      action: handleSeed,
      loading: seeding,
      loadingLabel: 'Seeding...',
      primary: true,
    },
    {
      label: 'Clear Cache',
      desc: 'Force-refresh all cached data. Use if changes are not reflecting on site.',
      action: handleClearCache,
      loading: clearing,
      loadingLabel: 'Clearing...',
      primary: false,
    },
  ];

  return (
    <section>
      <p className="text-[10px] tracking-[0.4em] uppercase text-white/20 mb-4">Data Management</p>
      <div className="border border-white/[0.07] bg-white/[0.02] divide-y divide-white/[0.05] rounded-lg">
        {actions.map(a => (
          <div key={a.label} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-semibold mb-0.5">{a.label}</p>
              <p className="text-xs text-white/30">{a.desc}</p>
            </div>
            <button
              onClick={a.action}
              disabled={a.loading}
              className={`ml-4 flex-shrink-0 text-[10px] font-bold tracking-[0.3em] uppercase px-4 py-2 transition-colors disabled:opacity-40 rounded ${
                a.primary
                  ? 'bg-white text-black hover:bg-white/90'
                  : 'border border-white/[0.15] text-white/60 hover:text-white hover:border-white/30'
              }`}
            >
              {a.loading ? a.loadingLabel : a.label}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
