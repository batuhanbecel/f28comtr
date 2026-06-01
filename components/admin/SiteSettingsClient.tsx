'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { AdminButton } from '@/components/admin/AdminButton';

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
    } catch {
      toast.error('Cleanup failed');
    } finally {
      setCleaning(false);
    }
  };

  return (
    <AdminPanel label="Data Management" title="Maintenance">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold mb-0.5">Cleanup Images</p>
          <p className="text-xs text-th-fg/30">Scan Redis for broken image URLs (404) and remove them automatically.</p>
        </div>
        <AdminButton onClick={handleCleanup} disabled={cleaning} className="flex-shrink-0 disabled:opacity-40">
          {cleaning ? 'Scanning...' : 'Cleanup Images'}
        </AdminButton>
      </div>
    </AdminPanel>
  );
}
