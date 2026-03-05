'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export function QuickActions() {
  const router = useRouter();

  const handleSeedData = async () => {
    if (!confirm('Seed data from static files? This will overwrite Redis data.')) return;
    
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json();
      
      if (res.ok) {
        toast.success(`Seeded ${data.photographers} photographers`);
        router.refresh();
      } else {
        toast.error(data.error || 'Seed failed');
      }
    } catch (error) {
      toast.error('Failed to seed data');
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleSeedData}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
        >
          🔄 Seed Data from Files
        </button>
        <button
          onClick={() => router.push('/admin/photographers')}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
        >
          ➕ Add Photographer
        </button>
        <button
          onClick={() => router.push('/admin/ai-images')}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
        >
          🤖 Manage AI Images
        </button>
      </div>
    </div>
  );
}
