import Image from 'next/image';
import { notFound } from 'next/navigation';
import { photographers as staticPhotographers } from '@/lib/data';
import { getPhotographers, getPhotographerImages } from '@/lib/db';
import { MasonryGrid } from '@/components/MasonryGrid';
import { Footer } from '@/components/Footer';
import { DownloadPortfolio } from '@/components/DownloadPortfolio';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';

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
    <ProductionSnapContainer snapMode="proximity">
      {/* Hero — snap point */}
      <section
        className="relative h-[80vh] md:h-screen w-full flex items-end justify-center pb-16 md:pb-24 vignette overflow-hidden"
        style={{ scrollSnapAlign: 'start' }}
      >
        <Image
          src={photographer.preview}
          alt={photographer.fullName}
          fill
          className="object-cover scale-[1.02]"
          priority
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent h-1/3" />

        <div className="relative z-10 text-center text-white px-4">
          <div className="hero-rule fade-in-up" style={{animationDelay: '0.05s'}} />
          <span className="section-label fade-in-up" style={{animationDelay: '0.1s'}}>{photographer.title}</span>
          <h1 className="heading-hero fade-in-up mt-2" style={{animationDelay: '0.2s'}}>
            {photographer.fullName}
          </h1>
          <div className="mt-8 fade-in-up" style={{animationDelay: '0.3s'}}>
            <DownloadPortfolio images={images} photographer={photographer} />
          </div>
        </div>
      </section>

      {/* Grid — snap point (grid itself scrolls freely) */}
      <div style={{ scrollSnapAlign: 'start' }}>
        <section className="py-12">
          <MasonryGrid images={images} photographerName={photographer.fullName} />
        </section>
        <Footer />
      </div>
    </ProductionSnapContainer>
  );
}
