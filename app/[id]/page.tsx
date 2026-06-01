import type { Metadata } from 'next';
import Image from 'next/image';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Photographer } from '@/lib/data';
import { photographers as staticPhotographers } from '@/lib/data';
import { getPhotographers, getPhotographerImages } from '@/lib/db';
import { shouldSkipOptimization } from '@/lib/blob';
import { HERO_IMAGE_SIZES } from '@/lib/imageSizes';
import { MasonryGrid } from '@/components/MasonryGrid';
import { MasonryGridSkeleton } from '@/components/MasonryGridSkeleton';
import { Footer } from '@/components/Footer';
import { DownloadPortfolio } from '@/components/DownloadPortfolio';
import { PhotographerHeroHeader } from '@/components/PhotographerHeroHeader';
import { PhotographerBio } from '@/components/PhotographerBio';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';
import { ViewTransition } from '@/lib/ViewTransition';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return staticPhotographers.map((photographer) => ({
    id: photographer.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const photographer = await getPhotographers().then((photographers) => photographers.find((p) => p.id === id));
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

async function DownloadButton({
  imagesPromise,
  photographer,
}: {
  imagesPromise: Promise<string[]>;
  photographer: Photographer;
}) {
  const images = await imagesPromise;
  return <DownloadPortfolio images={images} photographer={photographer} />;
}

async function MasonryGridStream({
  imagesPromise,
  photographer,
}: {
  imagesPromise: Promise<string[]>;
  photographer: Photographer;
}) {
  const images = await imagesPromise;
  return <MasonryGrid images={images} photographerName={photographer.fullName} />;
}

export default async function PortfolioPage({ params }: PageProps) {
  const { id } = await params;
  const photographer = await getPhotographers().then((photographers) => photographers.find((p) => p.id === id));
  if (!photographer) return notFound();

  // Start the heavy fetch but don't await — let two Suspense boundaries consume it
  const imagesPromise = getPhotographerImages(id);

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
      {/* Hero — renders immediately */}
      <section
        className="relative h-[80vh] md:h-screen w-full flex items-end justify-center pb-16 md:pb-24 vignette overflow-hidden"
        style={{ scrollSnapAlign: 'start' }}
      >
        <ViewTransition name={`photographer-${photographer.id}`}>
          <Image
            src={photographer.preview}
            alt={photographer.fullName}
            fill
            className="object-cover scale-[1.02]"
            loading="eager"
            fetchPriority="high"
            sizes={HERO_IMAGE_SIZES}
            quality={90}
            unoptimized={shouldSkipOptimization(photographer.preview)}
          />
        </ViewTransition>
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--c-bg)/0.95)] via-[rgb(var(--c-bg)/0.55)] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgb(var(--c-bg)/0.3)] to-transparent h-1/3" />

        <div className="relative z-10 text-th-fg px-4 w-full max-w-5xl">
          <PhotographerHeroHeader name={photographer.fullName} title={photographer.title}>
            <Suspense fallback={<div className="opacity-30 text-[10px] tracking-[0.3em] uppercase">Loading…</div>}>
              <DownloadButton imagesPromise={imagesPromise} photographer={photographer} />
            </Suspense>
          </PhotographerHeroHeader>
        </div>
      </section>

      {/* Grid — streams in after hero */}
      <div style={{ scrollSnapAlign: 'start' }}>
        <PhotographerBio
          bio={photographer.bio}
          instagram={photographer.instagram}
          website={photographer.website}
        />
        <section className="pb-12">
          <Suspense fallback={<MasonryGridSkeleton />}>
            <MasonryGridStream imagesPromise={imagesPromise} photographer={photographer} />
          </Suspense>
        </section>
        <Footer />
      </div>
    </ProductionSnapContainer>
  );
}
