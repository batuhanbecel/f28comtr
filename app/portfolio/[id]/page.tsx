import Image from 'next/image';
import { notFound } from 'next/navigation';
import { photographers as staticPhotographers } from '@/lib/data';
import { getPhotographers, getPhotographerImages } from '@/lib/db';
import { MasonryGrid } from '@/components/MasonryGrid';

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
      <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center">
        <Image
          src={photographer.preview}
          alt={photographer.fullName}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50" />
        
        <div className="relative z-10 text-center text-white px-4">
          <span className="section-label fade-in-up" style={{animationDelay: '0.05s'}}>{photographer.title}</span>
          <h1 className="heading-hero fade-in-up" style={{animationDelay: '0.15s'}}>
            {photographer.fullName}
          </h1>
        </div>
      </section>

      <section className="py-12">
        <MasonryGrid images={images} photographerName={photographer.fullName} />
      </section>
    </main>
  );
}
