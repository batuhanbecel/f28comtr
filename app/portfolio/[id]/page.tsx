import Image from 'next/image';
import { notFound } from 'next/navigation';
import { photographers as staticPhotographers } from '@/lib/data';
import { getPhotographers, getPhotographerImages } from '@/lib/db';
import { MasonryGrid } from '@/components/MasonryGrid';
import { Footer } from '@/components/Footer';
import { DownloadPortfolio } from '@/components/DownloadPortfolio';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return staticPhotographers.map((photographer) => ({
    id: photographer.id,
  }));
}

export default async function PortfolioPage({ params }: PageProps) {
  const { id } = await params;
  const photographers = await getPhotographers();
  const photographer = photographers.find((p) => p.id === id);

  if (!photographer) {
    notFound();
  }

  const images = await getPhotographerImages(id);

  return (
    <main className="min-h-screen">
      <section className="relative h-[70vh] md:h-[80vh] w-full flex items-center justify-center">
        <Image
          src={photographer.preview}
          alt={photographer.fullName}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />
        
        <div className="relative z-10 text-center text-white px-4">
          <span className="section-label fade-in-up" style={{animationDelay: '0.05s'}}>{photographer.title}</span>
          <h1 className="heading-hero fade-in-up" style={{animationDelay: '0.15s'}}>
            {photographer.fullName}
          </h1>
          <div className="flex items-center justify-center gap-5 mt-6 fade-in-up" style={{animationDelay: '0.25s'}}>
            <span className="text-white/55 text-[11px] tracking-[0.45em] uppercase">
              {images.length} Photos
            </span>
            <span className="w-px h-3.5 bg-white/20" />
            <DownloadPortfolio images={images} photographer={photographer} />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="px-4 mb-8 flex items-center gap-4">
          <span className="text-white/20 text-[10px] font-mono tracking-[0.3em]">
            {String(images.length).padStart(2, '0')} IMAGES
          </span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>
        <MasonryGrid images={images} photographerName={photographer.fullName} />
      </section>
      <Footer />
    </main>
  );
}
