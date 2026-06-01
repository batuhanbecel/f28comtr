'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { AdminButton } from '@/components/admin/AdminButton';
import { useAdminT } from '@/hooks/useAdminT';

export function SiteSettingsClient() {
  const [cleaning, setCleaning] = useState(false);
  const router = useRouter();
  const a = useAdminT();

  const handleCleanup = async () => {
    if (!confirm(a.settings.cleanupConfirm)) return;
    setCleaning(true);
    try {
      const res = await fetch('/api/admin/cleanup', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        if (data.totalRemoved > 0) router.refresh();
      } else {
        toast.error(data.error || a.settings.cleanupFailed);
      }
    } catch {
      toast.error(a.settings.cleanupFailed);
    } finally {
      setCleaning(false);
    }
  };

  return (
    <AdminPanel label={a.settings.dataManagement} title={a.settings.maintenance}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold mb-0.5">{a.settings.cleanupTitle}</p>
          <p className="text-xs text-th-fg/30">{a.settings.cleanupDesc}</p>
        </div>
        <AdminButton onClick={handleCleanup} disabled={cleaning} className="flex-shrink-0 disabled:opacity-40">
          {cleaning ? a.actions.scanning : a.actions.cleanupImages}
        </AdminButton>
      </div>
    </AdminPanel>
  );
}
