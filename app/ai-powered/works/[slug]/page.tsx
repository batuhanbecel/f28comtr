import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { AiWorkProjectNav } from '@/app/ai-powered/components/AiWorkProjectNav';
import { MasonryGrid } from '@/components/MasonryGrid';
import { Footer } from '@/components/Footer';
import { HeroSnapBody } from '@/components/HeroSnapBody';
import { HeroSnapTarget } from '@/components/HeroSnapTarget';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';
import { getAiPoweredWorks, getPageCopy } from '@/lib/cms';
import type { CreditPerson } from '@/lib/aiPoweredWorks';
import { shouldSkipOptimization } from '@/lib/blob';
import { HERO_IMAGE_SIZES } from '@/lib/imageSizes';
import { ViewTransition } from '@/lib/ViewTransition';
import { getServerLang } from '@/lib/serverLang';
import { absoluteUrl } from '@/lib/siteUrl';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const works = await getAiPoweredWorks();
  return works
    .filter((w): w is typeof w & { slug: string } =>
      typeof w.slug === 'string' && w.slug.length > 0,
    )
    .map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const works = await getAiPoweredWorks();
  const work = works.find((w) => w.slug === slug);
  if (!work) return { title: 'Work not found' };

  const title = [work.brand, work.title].filter(Boolean).join(' — ');
  return {
    title,
    description: work.description || `${work.brand} · AI-powered work by f/2.8 Production`,
    openGraph: {
      title,
      description: work.description,
      images: work.imageSrc ? [{ url: work.imageSrc }] : undefined,
      url: absoluteUrl(`/ai-powered/works/${slug}`),
    },
  };
}

export default async function AiPoweredWorkPage({ params }: PageProps) {
  const { slug } = await params;
  const [works, lang] = await Promise.all([getAiPoweredWorks(), getServerLang()]);
  const work = works.find((w) => w.slug === slug);
  if (!work) notFound();

  const copy = await getPageCopy('aiPowered', lang);
  const categoryLabels: Record<string, string> = {
    fullAi: copy.filters.fullAi,
    hybrid: copy.filters.hybrid,
  };
  const categoryLabel = categoryLabels[work.category] ?? work.category;

  const labels =
    lang === 'tr'
      ? {
          brand: 'Marka',
          agency: 'Ajans',
          year: 'Yıl',
          type: 'Tür',
          tags: 'Etiketler',
          instagram: 'Instagram\'da gör',
          back: 'AI Powered',
          gallery: 'Görseller',
          prevProject: 'Önceki Proje',
          nextProject: 'Sonraki Proje',
          projectNav: 'Çalışmalar arası gezinme',
          moreWorks: 'Diğer çalışmalar',
          photographers: 'Fotoğrafçı',
          aiArtists: 'AI Sanatçıları',
          retouchers: 'Retoucher\'lar',
        }
      : {
          brand: 'Brand',
          agency: 'Agency',
          year: 'Year',
          type: 'Type',
          tags: 'Tags',
          instagram: 'View on Instagram',
          back: 'AI Powered',
          gallery: 'Gallery',
          prevProject: 'Previous Project',
          nextProject: 'Next Project',
          projectNav: 'Work navigation',
          moreWorks: 'More works',
          photographers: 'Photographer',
          aiArtists: 'AI Artists',
          retouchers: 'Retouchers',
        };

  const credits = {
    photographers: work.credits?.photographers ?? [],
    aiArtists: work.credits?.aiArtists ?? [],
    retouchers: work.credits?.retouchers ?? [],
  };
  const hasCredits =
    credits.photographers.length > 0 ||
    credits.aiArtists.length > 0 ||
    credits.retouchers.length > 0;

  const heroAlt = work.imageAlt || [work.brand, work.title].filter(Boolean).join(' — ');
  const galleryImages = work.images.map((img) => img.src);
  const facts = [
    { label: labels.brand, value: work.brand },
    work.agency ? { label: labels.agency, value: work.agency } : null,
    work.year ? { label: labels.year, value: String(work.year) } : null,
    { label: labels.type, value: categoryLabel },
  ].filter((f): f is { label: string; value: string } => f !== null);

  return (
    <ProductionSnapContainer snapMode="heroSnap">
      {/* ── Hero — cinematic cover, morphs from the grid card ─────────────── */}
      <section className="relative flex h-[72vh] min-h-[440px] w-full items-end overflow-hidden md:h-screen">
        {work.imageSrc ? (
          <ViewTransition name={`ai-work-${slug}`}>
            <Image
              src={work.imageSrc}
              alt={heroAlt}
              fill
              priority
              fetchPriority="high"
              sizes={HERO_IMAGE_SIZES}
              quality={90}
              unoptimized={shouldSkipOptimization(work.imageSrc)}
              className="object-cover object-center"
            />
          </ViewTransition>
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--c-bg)/0.96)] via-[rgb(var(--c-bg)/0.5)] to-transparent" />
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[rgb(var(--c-bg)/0.4)] to-transparent" />

        <div className="absolute inset-x-0 top-0 z-10">
          <div className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-10">
            <Link
              href="/ai-powered"
              prefetch={false}
              className="section-label inline-block text-th-fg/60 transition-colors duration-ui hover:text-th-fg"
            >
              ← {labels.back}
            </Link>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 md:pb-16 lg:px-10">
          <div className="page-heading-stack gap-4">
            <span className="section-label section-label--pill text-th-fg/60">{work.brand}</span>
            <h1 className="heading-hero leading-[1.05]">{work.title || work.brand}</h1>
          </div>
        </div>
      </section>

      <HeroSnapBody className="min-h-screen bg-th-bg text-th-fg">
        {/* ── Details — editorial facts strip + description + credits ─────── */}
        <section className="mx-auto max-w-5xl px-4 pt-14 sm:px-6 md:pt-20 lg:px-10">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-7 border-b border-th-fg/10 pb-10 sm:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="space-y-1.5">
                <dt className="mono-label">{f.label}</dt>
                <dd className="body-text text-th-fg">{f.value}</dd>
              </div>
            ))}
          </dl>

          {work.description ? (
            <p className="body-text mt-10 max-w-3xl whitespace-pre-line leading-relaxed text-muted-body">
              {work.description}
            </p>
          ) : null}

          {work.tags && work.tags.length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-1.5">
              {work.tags.map((t) => (
                <span key={t} className="editorial-chip">
                  {t}
                </span>
              ))}
            </div>
          ) : null}

          {hasCredits ? (
            <section className="mt-10 grid gap-6 border-t border-th-fg/10 pt-10 sm:grid-cols-3">
              {credits.photographers.length > 0 ? (
                <CreditBlock label={labels.photographers} people={credits.photographers} />
              ) : null}
              {credits.aiArtists.length > 0 ? (
                <CreditBlock
                  label={labels.aiArtists}
                  people={credits.aiArtists.map((name) => ({ fullName: name }))}
                />
              ) : null}
              {credits.retouchers.length > 0 ? (
                <CreditBlock label={labels.retouchers} people={credits.retouchers} />
              ) : null}
            </section>
          ) : null}

          {work.instagramUrl ? (
            <a
              href={work.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-editorial mt-10 inline-flex"
            >
              {labels.instagram} ↗
            </a>
          ) : null}
        </section>

        {/* ── Gallery — full-bleed masonry, native mixed-orientation layout ── */}
        {galleryImages.length > 0 ? (
          <HeroSnapTarget className="hero-snap-target--pad">
            <section className="ai-portfolio-section pt-12 md:pt-16">
              <p className="section-label section-label--pill mx-auto mb-8 max-w-5xl px-4 sm:px-6 lg:px-10">
                {labels.gallery}
              </p>
              <MasonryGrid
                images={galleryImages}
                photographerName={[work.brand, work.title].filter(Boolean).join(' — ') || work.brand}
                fullWidth
              />
            </section>
          </HeroSnapTarget>
        ) : null}

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <AiWorkProjectNav
            works={works}
            currentSlug={slug}
            prevLabel={labels.prevProject}
            nextLabel={labels.nextProject}
            ariaLabel={labels.projectNav}
            sectionLabel={labels.moreWorks}
          />
        </div>

        <Footer />
      </HeroSnapBody>
    </ProductionSnapContainer>
  );
}

function CreditBlock({ label, people }: { label: string; people: CreditPerson[] }) {
  return (
    <div className="space-y-2">
      <p className="mono-label">{label}</p>
      <ul className="flex flex-wrap gap-2">
        {people.map((p, i) => (
          <li key={`${p.fullName}-${i}`}>
            {p.slug ? (
              <Link href={`/${p.slug}`} className="editorial-chip">
                {p.fullName}
              </Link>
            ) : (
              <span className="editorial-chip">{p.fullName}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
