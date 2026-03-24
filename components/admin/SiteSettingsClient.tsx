'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export function SiteSettingsClient() {
  const [cleaning, setCleaning] = useState(false);
  const router = useRouter();

  const handleCleanup = async () => {
    if (!confirm('Scan all image URLs in Redis and remove broken (404) references? This may take a minute.')) return;
    setCleaning(true);
    try {
      const res = await fetch('/api/admin/cleanup', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        if (data.totalRemoved > 0) router.refresh();
      } else {
        toast.error(data.error || 'Cleanup failed');
      }
    } catch { toast.error('Cleanup failed'); }
    finally { setCleaning(false); }
  };

  const actions = [
    {
      label: 'Cleanup Images',
      desc: 'Scan Redis for broken image URLs (404) and remove them automatically.',
      action: handleCleanup,
      loading: cleaning,
      loadingLabel: 'Scanning...',
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
