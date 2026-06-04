import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { Footer } from '@/components/Footer';
import { shouldSkipOptimization } from '@/lib/blob';
import { getAiPoweredWorks, getPageCopy } from '@/lib/cms';
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
    visual: copy.filters.visual,
    video: copy.filters.video,
    hybrid: copy.filters.hybrid,
  };
  const categoryLabel = categoryLabels[work.category] ?? work.category;

  const labels =
    lang === 'tr'
      ? {
          brand: 'Marka',
          year: 'Yıl',
          type: 'Tür',
          tags: 'Etiketler',
          instagram: 'Instagram\'da gör',
          back: '← AI Powered\'a dön',
        }
      : {
          brand: 'Brand',
          year: 'Year',
          type: 'Type',
          tags: 'Tags',
          instagram: 'View on Instagram',
          back: '← Back to AI Powered',
        };

  return (
    <>
      <main className="min-h-screen bg-th-bg text-th-fg pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Link
            href="/ai-powered"
            prefetch={false}
            className="inline-block mb-10 text-[10px] tracking-[0.3em] uppercase text-th-fg/50 hover:text-th-fg transition-colors"
          >
            {labels.back}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 lg:gap-16 items-start">
            <div className="relative w-full aspect-[4/5] lg:aspect-[3/4] bg-th-fg/[0.04] overflow-hidden">
              <Image
                src={work.imageSrc}
                alt={work.imageAlt || `${work.brand} — ${work.title}`}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
                className="object-cover"
                unoptimized={shouldSkipOptimization(work.imageSrc)}
              />
            </div>

            <aside className="space-y-8 lg:pt-4">
              <header className="space-y-3 border-b border-th-fg/10 pb-6">
                <p className="text-[10px] tracking-[0.4em] uppercase text-th-fg/40">
                  {work.brand}
                </p>
                {work.title ? (
                  <h1 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                    {work.title}
                  </h1>
                ) : null}
              </header>

              <dl className="space-y-5 text-sm">
                <div className="grid grid-cols-[6rem_1fr] gap-4 items-baseline">
                  <dt className="text-[10px] tracking-[0.3em] uppercase text-th-fg/40">
                    {labels.brand}
                  </dt>
                  <dd className="text-th-fg">{work.brand}</dd>
                </div>
                {work.year ? (
                  <div className="grid grid-cols-[6rem_1fr] gap-4 items-baseline">
                    <dt className="text-[10px] tracking-[0.3em] uppercase text-th-fg/40">
                      {labels.year}
                    </dt>
                    <dd className="text-th-fg">{work.year}</dd>
                  </div>
                ) : null}
                <div className="grid grid-cols-[6rem_1fr] gap-4 items-baseline">
                  <dt className="text-[10px] tracking-[0.3em] uppercase text-th-fg/40">
                    {labels.type}
                  </dt>
                  <dd className="text-th-fg">{categoryLabel}</dd>
                </div>
                {work.tags && work.tags.length > 0 ? (
                  <div className="grid grid-cols-[6rem_1fr] gap-4 items-baseline">
                    <dt className="text-[10px] tracking-[0.3em] uppercase text-th-fg/40">
                      {labels.tags}
                    </dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {work.tags.map((t) => (
                        <span
                          key={t}
                          className="inline-block px-2 py-1 text-[10px] tracking-wider uppercase bg-th-fg/[0.06] text-th-fg/70"
                        >
                          {t}
                        </span>
                      ))}
                    </dd>
                  </div>
                ) : null}
              </dl>

              {work.description ? (
                <p className="text-sm leading-relaxed text-th-fg/80 whitespace-pre-line">
                  {work.description}
                </p>
              ) : null}

              {work.instagramUrl ? (
                <a
                  href={work.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-5 py-3 text-[10px] tracking-[0.3em] uppercase border border-th-fg/20 hover:bg-th-fg hover:text-th-bg transition-colors"
                >
                  {labels.instagram} ↗
                </a>
              ) : null}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
