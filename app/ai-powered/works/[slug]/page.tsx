import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { AiWorkDetailLayout } from '@/app/ai-powered/components/AiWorkDetailLayout';
import { AiWorkProjectNav } from '@/app/ai-powered/components/AiWorkProjectNav';
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
          back: 'AI Powered',
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

  return (
    <>
      <main className="min-h-screen bg-th-bg text-th-fg pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Link
            href="/ai-powered"
            prefetch={false}
            className="section-label mb-10 inline-block text-th-fg/50 transition-colors duration-ui hover:text-th-fg"
          >
            ← {labels.back}
          </Link>

          <AiWorkDetailLayout
            workSlug={slug}
            images={work.images}
            imageAlt={work.imageAlt || `${work.brand} — ${work.title}`}
          >
            <div className="space-y-8">
              <header className="page-heading-stack gap-4 border-b border-th-fg/10 pb-8">
                <span className="section-label text-th-fg/40">{work.brand}</span>
                {work.title ? (
                  <h1 className="heading-section leading-tight">{work.title}</h1>
                ) : (
                  <h1 className="heading-section leading-tight">{work.brand}</h1>
                )}
              </header>

              <dl className="space-y-5">
                <MetaRow label={labels.brand} value={work.brand} />
                {work.agency ? <MetaRow label={labels.agency} value={work.agency} /> : null}
                {work.year ? <MetaRow label={labels.year} value={String(work.year)} /> : null}
                <MetaRow label={labels.type} value={categoryLabel} />
                {work.tags && work.tags.length > 0 ? (
                  <div className="grid grid-cols-[6rem_1fr] gap-4 items-start">
                    <dt className="mono-label pt-0.5">{labels.tags}</dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {work.tags.map((t) => (
                        <span key={t} className="editorial-chip">
                          {t}
                        </span>
                      ))}
                    </dd>
                  </div>
                ) : null}
              </dl>

              {work.description ? (
                <p className="body-text text-muted-body whitespace-pre-line leading-relaxed">
                  {work.description}
                </p>
              ) : null}

              {hasCredits ? (
                <section className="space-y-5 border-t border-th-fg/10 pt-8">
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
                  className="btn-editorial mt-2 inline-flex"
                >
                  {labels.instagram} ↗
                </a>
              ) : null}
            </div>
          </AiWorkDetailLayout>

          <AiWorkProjectNav
            works={works}
            currentSlug={slug}
            prevLabel={labels.prevProject}
            nextLabel={labels.nextProject}
            ariaLabel={labels.projectNav}
            sectionLabel={labels.moreWorks}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[6rem_1fr] gap-4 items-baseline">
      <dt className="mono-label">{label}</dt>
      <dd className="body-text text-th-fg">{value}</dd>
    </div>
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
