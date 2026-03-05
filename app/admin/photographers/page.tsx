import Link from 'next/link';
import { cookies } from 'next/headers';
import { getPhotographers } from '@/lib/db';
import { PhotographerCard } from '@/components/admin/PhotographerCard';
import { AddPhotographerForm } from '@/components/admin/AddPhotographerForm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function deletePhotographer(formData: FormData) {
  'use server';
  
  const id = formData.get('id') as string;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/admin/photographers/${id}`, {
      method: 'DELETE',
    });
    
    if (!res.ok) throw new Error('Delete failed');
    
    revalidatePath('/admin/photographers');
  } catch (error) {
    console.error('Delete error:', error);
  }
}

async function reorderPhotographers(formData: FormData) {
  'use server';
  
  const ids = JSON.parse(formData.get('ids') as string);
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/admin/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    
    if (!res.ok) throw new Error('Reorder failed');
    
    revalidatePath('/admin/photographers');
  } catch (error) {
    console.error('Reorder error:', error);
  }
}

export default async function PhotographersPage() {
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
        <div className="mb-8 flex items-end justify-between">
          <div>
            <Link href="/admin" className="text-white/50 text-sm mb-2 inline-block hover:text-white">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold mb-2">Photographers</h1>
            <p className="text-white/50">Manage your photographers and their portfolios</p>
          </div>
        </div>

        {/* Add New Photographer */}
        <AddPhotographerForm />

        {/* Photographers Grid */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">All Photographers ({photographers.length})</h2>
          {photographers.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-lg p-12 text-center">
              <p className="text-white/50 mb-4">No photographers found</p>
              <p className="text-sm text-white/30">Add your first photographer above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {photographers.map((photographer, index) => (
                <PhotographerCard
                  key={photographer.id}
                  photographer={photographer}
                  index={index}
                  total={photographers.length}
                  deleteAction={deletePhotographer}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
