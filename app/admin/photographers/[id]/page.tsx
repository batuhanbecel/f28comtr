import { redirect } from 'next/navigation';
import { getPhotographers, getPhotographerImages } from '@/lib/db';
import { PhotographerImageGallery } from '@/components/admin/PhotographerImageGallery';
import { PhotographerInfoForm } from '@/components/admin/PhotographerInfoForm';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { AdminPanel } from '@/components/admin/AdminPanel';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPhotographerPage({ params }: PageProps) {
  const { id } = await params;
  const photographers = await getPhotographers();
  const photographer = photographers.find((p) => p.id === id);

  if (!photographer) {
    redirect('/admin/photographers');
  }

  const images = await getPhotographerImages(id);

  return (
    <AdminPageLayout
      title={photographer.fullName}
      breadcrumb={{ href: '/admin/photographers', label: 'Photographers' }}
    >
      <p className="text-th-fg/40 text-sm mb-8">Edit photographer information and manage portfolio images</p>

      <PhotographerInfoForm photographer={photographer} />

      <AdminPanel label="Portfolio" title="Images" className="mt-8">
        <PhotographerImageGallery
          images={images}
          photographerId={id}
          photographerName={photographer.fullName}
        />
      </AdminPanel>
    </AdminPageLayout>
  );
}
