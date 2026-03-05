import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPhotographers } from '@/lib/db';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { QuickActions } from '@/components/admin/QuickActions';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('f28-admin-session');
  
  // Verify the session token
  const isAuthenticated = sessionCookie?.value ? true : false;

  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  const photographers = await getPhotographers();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-white/50">Manage your photography portfolio website</p>
        </div>

        {/* Stats */}
        <DashboardStats photographers={photographers} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Activity */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/photographers"
              className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
            >
              <div className="text-2xl mb-2">👥</div>
              <h3 className="font-semibold mb-1">Manage Photographers</h3>
              <p className="text-sm text-white/50">{photographers.length} photographers</p>
            </Link>
            <Link
              href="/admin/ai-images"
              className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
            >
              <div className="text-2xl mb-2">🤖</div>
              <h3 className="font-semibold mb-1">AI Images</h3>
              <p className="text-sm text-white/50">Manage AI-generated content</p>
            </Link>
            <Link
              href="/admin/settings"
              className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
            >
              <div className="text-2xl mb-2">⚙️</div>
              <h3 className="font-semibold mb-1">Settings</h3>
              <p className="text-sm text-white/50">Configure your site</p>
            </Link>
          </div>
        </div>

        {/* View Site */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors"
          >
            View Live Site →
          </Link>
        </div>
      </div>
    </div>
  );
}
