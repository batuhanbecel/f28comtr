'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export function SettingsForm() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleClearCache = async () => {
    if (!confirm('Clear all cache? This will force fresh data on next load.')) return;
    
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/cache', { method: 'DELETE' });
      if (res.ok) {
        toast.success('Cache cleared successfully');
        router.refresh();
      } else {
        toast.error('Failed to clear cache');
      }
    } catch (error) {
      toast.error('Failed to clear cache');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSeedData = async () => {
    if (!confirm('Seed data from files? This will add new images while preserving your custom order.')) return;
    
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json();
      
      if (res.ok) {
        toast.success(`Seeded ${data.photographers} photographers, ${data.newImages || 0} new images added`);
        router.refresh();
      } else {
        toast.error(data.error || 'Seed failed');
      }
    } catch (error) {
      toast.error('Failed to seed data');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Data Management */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Data Management</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <h3 className="font-semibold mb-1">Seed from Files</h3>
              <p className="text-sm text-white/50">
                Import images from filesystem. Preserves your custom ordering.
              </p>
            </div>
            <button
              onClick={handleSeedData}
              disabled={isSaving}
              className="px-4 py-2 bg-white text-black font-semibold rounded hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Seeding...' : 'Seed Data'}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <h3 className="font-semibold mb-1">Clear Cache</h3>
              <p className="text-sm text-white/50">
                Force refresh all cached data on next page load.
              </p>
            </div>
            <button
              onClick={handleClearCache}
              disabled={isSaving}
              className="px-4 py-2 bg-white/10 border border-white/20 font-semibold rounded hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Clearing...' : 'Clear Cache'}
            </button>
          </div>
        </div>
      </div>

      {/* Environment Info */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Environment</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-white/10">
            <span className="text-white/50">Redis Status</span>
            <span className="font-mono text-green-400">Connected</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/10">
            <span className="text-white/50">Vercel Blob</span>
            <span className="font-mono text-green-400">Configured</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-white/50">Node Environment</span>
            <span className="font-mono">{process.env.NODE_ENV || 'development'}</span>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 gap-3">
          <a
            href="https://vercel.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-sm"
          >
            Vercel Dashboard →
          </a>
          <a
            href="https://console.upstash.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-sm"
          >
            Upstash Console →
          </a>
        </div>
      </div>
    </div>
  );
}
