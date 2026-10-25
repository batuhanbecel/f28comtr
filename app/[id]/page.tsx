import type { Metadata } from 'next';
import Image from '@/components/Image';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { photographers as staticPhotographers } from '@/lib/data';
import { getPhotographers, getPhotographerImages, type Photographer } from '@/lib/cms';
import { shouldSkipOptimization } from '@/lib/blob';
import { HERO_IMAGE_SIZES } from '@/lib/imageSizes';
import { MasonryGrid } from '@/components/MasonryGrid';
import { MasonryGridSkeleton } from '@/components/MasonryGridSkeleton';
import { Footer } from '@/components/Footer';
import { DownloadPortfolio } from '@/components/DownloadPortfolio';
import { PhotographerHeroHeader } from '@/components/PhotographerHeroHeader';
import { HeroSnapBody } from '@/components/HeroSnapBody';
import { HeroSnapTarget } from '@/components/HeroSnapTarget';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';
import { ViewTransition } from '@/lib/ViewTransition';
import { generatePhotographerMetadata, SITE_NAME } from '@/lib/seo';
import { absoluteUrl, getSiteUrl } from '@/lib/siteUrl';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  let list = staticPhotographers;
  try {
    const cmsPhotographers = await getPhotographers();
    if (cmsPhotographers.length > 0) list = cmsPhotographers;
  } catch {
    /* fallback to static */
  }
  return list.map((photographer) => ({
    id: photographer.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const photographer = await getPhotographers().then((photographers) =>
    photographers.find((p) => p.id === id),
  );
  return generatePhotographerMetadata(photographer, id);
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

  const siteUrl = getSiteUrl();
  const previewUrl = photographer.preview.startsWith('http')
    ? photographer.preview
    : absoluteUrl(photographer.preview);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: photographer.fullName,
    jobTitle: photographer.title,
    image: previewUrl,
    url: `${siteUrl}/${photographer.id}`,
    worksFor: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: siteUrl,
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
        className="relative h-[80vh] md:h-[100svh] w-full flex items-end justify-center pb-16 md:pb-24 overflow-hidden"
      >
        <ViewTransition name={`photographer-${photographer.id}`}>
          <Image
            src={photographer.preview}
            alt={photographer.fullName}
            fill
            className="object-cover"
            loading="eager"
            fetchPriority="high"
            sizes={HERO_IMAGE_SIZES}
            quality={90}
            unoptimized={shouldSkipOptimization(photographer.preview)}
          />
        </ViewTransition>
        {/* Readable strip under the name only — the portrait itself stays untouched */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 via-35% to-transparent to-60%" aria-hidden />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/35 to-transparent" aria-hidden />

        {/* Copy sits on photography in both themes — pin theme tokens to white */}
        <div
          className="relative z-10 text-th-fg g-inner w-full"
          style={{ '--c-fg': '255 255 255', '--c-bg': '0 0 0' } as React.CSSProperties}
        >
          <PhotographerHeroHeader name={photographer.fullName} title={photographer.title}>
            <Suspense fallback={<div className="h-11 w-52 border border-th-fg/10 bg-th-fg/[0.03] animate-pulse" aria-hidden="true" />}>
              <DownloadButton imagesPromise={imagesPromise} photographer={photographer} />
            </Suspense>
          </PhotographerHeroHeader>
        </div>
      </section>

      {/* Grid — streams in after hero */}
      <HeroSnapBody>
        <HeroSnapTarget className="hero-snap-target--pad">
        <section className="pb-12">
          <Suspense fallback={<MasonryGridSkeleton />}>
            <MasonryGridStream imagesPromise={imagesPromise} photographer={photographer} />
          </Suspense>
        </section>
        </HeroSnapTarget>
        <Footer />
      </HeroSnapBody>
    </ProductionSnapContainer>
  );
}
