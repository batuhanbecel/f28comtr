import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { AiWorkDetailLayout } from '@/app/ai-powered/components/AiWorkDetailLayout';
import { Footer } from '@/components/Footer';
import { getAiPoweredWorks, getPageCopy } from '@/lib/cms';
import type { CreditPerson } from '@/lib/aiPoweredWorks';
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
          agency: 'Ajans',
          year: 'Yıl',
          type: 'Tür',
          tags: 'Etiketler',
          instagram: 'Instagram\'da gör',
          back: '← AI Powered\'a dön',
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
          back: '← Back to AI Powered',
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

          <AiWorkDetailLayout
            images={work.images}
            imageAlt={work.imageAlt || `${work.brand} — ${work.title}`}
          >
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
                {work.agency ? (
                  <div className="grid grid-cols-[6rem_1fr] gap-4 items-baseline">
                    <dt className="text-[10px] tracking-[0.3em] uppercase text-th-fg/40">
                      {labels.agency}
                    </dt>
                    <dd className="text-th-fg">{work.agency}</dd>
                  </div>
                ) : null}
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

              {hasCredits ? (
                <section className="space-y-4 pt-6 border-t border-th-fg/10">
                  {credits.photographers.length > 0 ? (
                    <CreditBlock
                      label={labels.photographers}
                      people={credits.photographers}
                    />
                  ) : null}
                  {credits.aiArtists.length > 0 ? (
                    <CreditBlock
                      label={labels.aiArtists}
                      people={credits.aiArtists.map((name) => ({ fullName: name }))}
                    />
                  ) : null}
                  {credits.retouchers.length > 0 ? (
                    <CreditBlock
                      label={labels.retouchers}
                      people={credits.retouchers}
                    />
                  ) : null}
                </section>
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
          </AiWorkDetailLayout>
        </div>
      </main>
      <Footer />
    </>
  );
}

function CreditBlock({ label, people }: { label: string; people: CreditPerson[] }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] tracking-[0.3em] uppercase text-th-fg/40">{label}</p>
      <ul className="text-sm text-th-fg">
        {people.map((p, i) => (
          <li key={`${p.fullName}-${i}`}>
            {p.slug ? (
              <Link
                href={`/${p.slug}`}
                className="underline-offset-4 hover:underline text-th-fg hover:text-th-fg transition-colors"
              >
                {p.fullName}
              </Link>
            ) : (
              <span>{p.fullName}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
