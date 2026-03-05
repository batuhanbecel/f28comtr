import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { SettingsForm } from '@/components/admin/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('f28-admin-session');
  
  if (!sessionCookie?.value) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="text-white/50 text-sm mb-2 inline-block hover:text-white">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-white/50">Configure your website settings and preferences</p>
        </div>

        <SettingsForm />
      </div>
    </div>
  );
}
