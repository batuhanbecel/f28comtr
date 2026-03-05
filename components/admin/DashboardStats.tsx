import type { Photographer } from '@/lib/data';

interface DashboardStatsProps {
  photographers: Photographer[];
}

export async function DashboardStats({ photographers }: DashboardStatsProps) {
  // Calculate stats
  const totalPhotographers = photographers.length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <div className="text-white/50 text-sm mb-2">Total Photographers</div>
        <div className="text-3xl font-bold">{totalPhotographers}</div>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <div className="text-white/50 text-sm mb-2">Active Portfolios</div>
        <div className="text-3xl font-bold">{totalPhotographers}</div>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <div className="text-white/50 text-sm mb-2">Total Images</div>
        <div className="text-3xl font-bold">-</div>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <div className="text-white/50 text-sm mb-2">AI Images</div>
        <div className="text-3xl font-bold">-</div>
      </div>
    </div>
  );
}
