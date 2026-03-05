import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAIImages } from '@/lib/db';
import { AIImageManager } from '@/components/admin/AIImageManager';

export const dynamic = 'force-dynamic';

export default async function AIImagesPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get('f28-admin-session')?.value) redirect('/admin/login');

  const images = await getAIImages();

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/[0.06] px-8 py-5 flex items-center justify-between sticky top-0 bg-black/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-white/25 text-[10px] tracking-[0.3em] uppercase hover:text-white/60 transition-colors">
            ← Dashboard
          </Link>
          <div className="w-px h-3 bg-white/10" />
          <span className="text-white/25 text-[10px] tracking-[0.3em] uppercase">AI Images</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="mb-8">
          <p className="text-white/20 text-[10px] tracking-[0.5em] uppercase mb-2">Admin / AI Images</p>
          <h1 className="text-3xl font-black tracking-tighter">AI IMAGES</h1>
          <p className="text-white/25 text-xs mt-1">{images.length} images — drag to reorder, hover to delete</p>
        </div>

        <AIImageManager images={images} />
      </div>
    </div>
  );
}
