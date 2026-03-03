import Image from 'next/image';
import { notFound } from 'next/navigation';
import { photographers } from '@/lib/data';
import { getPortfolioImages } from '@/lib/utils';
import { MasonryGrid } from '@/components/MasonryGrid';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return photographers.map((photographer) => ({
    id: photographer.id,
  }));
}

export default async function PortfolioPage({ params }: PageProps) {
  const { id } = await params;
  const photographer = photographers.find((p) => p.id === id);

  if (!photographer) {
    notFound();
  }

  const images = getPortfolioImages(photographer.folder);

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
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-wider">
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
