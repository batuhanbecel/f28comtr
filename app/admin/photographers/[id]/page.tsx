import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getPhotographers, getPhotographerImages } from '@/lib/db';
import { PhotographerImageGallery } from '@/components/admin/PhotographerImageGallery';
import { PhotographerInfoForm } from '@/components/admin/PhotographerInfoForm';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPhotographerPage({ params }: PageProps) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('f28-admin-session');
  
  if (!sessionCookie?.value) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const photographers = await getPhotographers();
  const photographer = photographers.find(p => p.id === id);

  if (!photographer) {
    redirect('/admin/photographers');
  }

  const images = await getPhotographerImages(id);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/photographers" className="text-white/50 text-sm mb-2 inline-block hover:text-white">
            ← Back to Photographers
          </Link>
          <h1 className="text-4xl font-bold mb-2">{photographer.fullName}</h1>
          <p className="text-white/50">Edit photographer information and manage portfolio images</p>
        </div>

        {/* Photographer Info */}
        <PhotographerInfoForm photographer={photographer} />

        {/* Image Gallery */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Portfolio Images</h2>
          <PhotographerImageGallery 
            images={images} 
            photographerId={id}
            photographerName={photographer.fullName}
          />
        </div>
      </div>
    </div>
  );
}
