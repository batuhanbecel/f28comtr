import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAIImages } from '@/lib/db';
import { AIImageGallery } from '@/components/admin/AIImageGallery';

export const dynamic = 'force-dynamic';

export default async function AIImagesPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('f28-admin-session');
  
  if (!sessionCookie?.value) {
    redirect('/admin/login');
  }

  const aiImages = await getAIImages();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="text-white/50 text-sm mb-2 inline-block hover:text-white">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2">AI Images</h1>
          <p className="text-white/50">Manage AI-generated images ({aiImages.length} total)</p>
        </div>

        <AIImageGallery images={aiImages} />
      </div>
    </div>
  );
}
