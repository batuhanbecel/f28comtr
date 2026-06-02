import { redirect } from 'next/navigation';
import { requireAdminSession } from '@/lib/auth';
import { getPhotographers, getPhotographerImages } from '@/lib/db';
import { PhotographerImageGallery } from '@/components/admin/PhotographerImageGallery';
import { PhotographerInfoForm } from '@/components/admin/PhotographerInfoForm';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { getAdminT } from '@/lib/getAdminT';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPhotographerPage({ params }: PageProps) {
  await requireAdminSession();
  const { id } = await params;
  const a = await getAdminT();
  const photographers = await getPhotographers();
  const photographer = photographers.find((p) => p.id === id);

  if (!photographer) {
    redirect('/admin/photographers');
  }

  const images = await getPhotographerImages(id);

  return (
    <AdminPageLayout
      title={photographer.fullName}
      breadcrumb={{ href: '/admin/photographers', label: a.nav.photographers }}
    >
      <p className="text-th-fg/40 text-sm mb-8">{a.photographerEdit.intro}</p>

      <PhotographerInfoForm photographer={photographer} />

      <AdminPanel label={a.photographerEdit.portfolio} title={a.photographerEdit.images} className="mt-8">
        <PhotographerImageGallery
          images={images}
          photographerId={id}
          photographerName={photographer.fullName}
        />
      </AdminPanel>
    </AdminPageLayout>
  );
}
