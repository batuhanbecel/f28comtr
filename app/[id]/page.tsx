import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { photographers as staticPhotographers } from '@/lib/data';
import { getPhotographers, getPhotographerImages } from '@/lib/db';
import { shouldSkipOptimization } from '@/lib/blob';
import { MasonryGrid } from '@/components/MasonryGrid';
import { Footer } from '@/components/Footer';
import { DownloadPortfolio } from '@/components/DownloadPortfolio';
import { TitleLabel } from '@/components/TitleLabel';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';

export const revalidate = 60;

interface PageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  return staticPhotographers.map((photographer) => ({
    id: photographer.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const photographer = await getPhotographers().then((photographers) => photographers.find((p) => p.id === params.id));
  if (!photographer) return { title: 'Portfolio | f/2.8 Production' };
  return {
    title: `${photographer.fullName} | f/2.8 Production`,
    description: `${photographer.title} portfolio — ${photographer.fullName} at f/2.8 Production Agency.`,
    openGraph: {
      title: photographer.fullName,
      images: [{ url: photographer.preview }],
    },
  };
}

export default async function PortfolioPage({ params }: PageProps) {
  const photographer = await getPhotographers().then((photographers) => photographers.find((p) => p.id === params.id));
  if (!photographer) return notFound();
  const images = await getPhotographerImages(params.id);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: photographer.fullName,
    jobTitle: photographer.title,
    image: `https://www.f28.com.tr${photographer.preview}`,
    url: `https://www.f28.com.tr/${photographer.id}`,
    worksFor: {
      '@type': 'Organization',
      name: 'f/2.8 Production Agency',
      url: 'https://www.f28.com.tr',
    },
  };

  return (
    <ProductionSnapContainer snapMode="heroSnap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
          unoptimized={shouldSkipOptimization(photographer.preview)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent h-1/3" />

        <div className="relative z-10 text-center text-white px-4">
          <div className="hero-rule fade-in-up" style={{animationDelay: '0.05s', background: 'rgba(255,255,255,0.25)'}} />
          <TitleLabel photographer={photographer} />
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
