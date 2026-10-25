import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { AiWorkGalleryColumn } from '@/app/ai-powered/components/AiWorkGalleryColumn';
import { Footer } from '@/components/Footer';
import { getAiPoweredWorks, getPageCopy } from '@/lib/cms';
import type { CreditPerson } from '@/lib/aiPoweredWorks';
import { getServerLang } from '@/lib/serverLang';
import { toNameCase } from '@/lib/displayCase';
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
  const work = (await getAiPoweredWorks()).find((w) => w.slug === slug);
  // 404 before any cookie read — see production/works/[slug]
  if (!work) notFound();

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
  const works = await getAiPoweredWorks();
  const work = works.find((w) => w.slug === slug);
  if (!work) notFound();
  const lang = await getServerLang();

  const copy = await getPageCopy('aiPowered', lang);
  const categoryLabels: Record<string, string> = {
    fullAi: copy.filters.fullAi,
    hybrid: copy.filters.hybrid,
  };
  const categoryLabel = categoryLabels[work.category] ?? work.category;


  const labels =
    lang === 'tr'
      ? {
          agency: 'Ajans',
          year: 'Yıl',
          type: 'Tür',
          tags: 'Etiketler',
          instagram: 'Instagram\'da gör',
          back: 'AI-Powered',
          prevProject: 'Önceki proje',
          nextProject: 'Sonraki proje',
          projectNav: 'Çalışmalar arası gezinme',
          photographers: 'Fotoğraf',
          aiArtists: 'AI sanatçıları',
          retouchers: 'Rötuş',
        }
      : {
          agency: 'Agency',
          year: 'Year',
          type: 'Type',
          tags: 'Tags',
          instagram: 'View on Instagram',
          back: 'AI-Powered',
          prevProject: 'Previous project',
          nextProject: 'Next project',
          projectNav: 'Work navigation',
          photographers: 'Photography',
          aiArtists: 'AI artists',
          retouchers: 'Retouch',
        };

  const credits = {
    photographers: work.credits?.photographers ?? [],
    // Typed free-form in Studio, often in caps — same name casing as the roster
    aiArtists: (work.credits?.aiArtists ?? []).map((name) => ({ fullName: toNameCase(name) })),
    retouchers: work.credits?.retouchers ?? [],
  };

  // Same case-study layout as Production works: title + details, then the work
  const listed = works.filter((w) => w.slug);
  const index = listed.findIndex((w) => w.slug === slug);
  const prev = index > 0 ? listed[index - 1] : null;
  const next = index >= 0 && index < listed.length - 1 ? listed[index + 1] : null;

  const meta: { label: string; value: React.ReactNode }[] = [
    ...(work.agency ? [{ label: labels.agency, value: work.agency }] : []),
    ...(work.year ? [{ label: labels.year, value: String(work.year) }] : []),
    { label: labels.type, value: categoryLabel },
    ...(work.tags?.length ? [{ label: labels.tags, value: work.tags.join(', ') }] : []),
    ...(credits.photographers.length
      ? [{ label: labels.photographers, value: <People people={credits.photographers} /> }]
      : []),
    ...(credits.aiArtists.length ? [{ label: labels.aiArtists, value: <People people={credits.aiArtists} /> }] : []),
    ...(credits.retouchers.length ? [{ label: labels.retouchers, value: <People people={credits.retouchers} /> }] : []),
  ];

  return (
    <>
      <main className="min-h-screen bg-th-bg text-th-fg">
        <header className="editorial-hero">
          <div className="editorial-hero__inner">
            <div className="editorial-hero__title">
              <Link
                href="/ai-powered"
                prefetch={false}
                className="section-label transition-opacity duration-ui hover:opacity-100"
              >
                ← {labels.back}
              </Link>
              {/* Brand shows once: as the eyebrow when the work has its own title */}
              {work.title ? <p className="text-muted-body">{work.brand}</p> : null}
              <h1 className="heading-hero">{work.title || work.brand}</h1>
            </div>
            <div className="flex flex-col gap-8">
              {work.description ? (
                <p className="body-text whitespace-pre-line text-muted-body max-w-[34rem]">{work.description}</p>
              ) : null}
              <dl className="project-meta">
                {meta.map((row) => (
                  <div key={row.label} className="project-meta__row">
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
              {work.instagramUrl ? (
                <a
                  href={work.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-editorial inline-flex w-fit"
                >
                  {labels.instagram} ↗
                </a>
              ) : null}
            </div>
          </div>
        </header>

        <section className="page-section">
          <div className="mx-auto max-w-6xl">
            <AiWorkGalleryColumn
              workSlug={slug}
              images={work.images}
              imageAlt={work.imageAlt || `${work.brand} — ${work.title}`}
            />
          </div>
        </section>

        {prev || next ? (
          <nav aria-label={labels.projectNav} className="page-section page-section--border">
            <div className="project-nav">
              {prev ? (
                <Link href={`/ai-powered/works/${prev.slug}`} className="project-nav__link group">
                  <span className="text-sm text-th-fg/72">← {labels.prevProject}</span>
                  <span className="heading-lg group-hover:underline underline-offset-4 decoration-1">
                    {prev.title || prev.brand}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link href={`/ai-powered/works/${next.slug}`} className="project-nav__link project-nav__link--next group">
                  <span className="text-sm text-th-fg/72">{labels.nextProject} →</span>
                  <span className="heading-lg group-hover:underline underline-offset-4 decoration-1">
                    {next.title || next.brand}
                  </span>
                </Link>
              ) : null}
            </div>
          </nav>
        ) : null}
      </main>
      <Footer />
    </>
  );
}


function People({ people }: { people: CreditPerson[] }) {
  return (
    <>
      {people.map((p, i) => (
        <span key={`${p.fullName}-${i}`}>
          {i > 0 ? ', ' : null}
          {p.slug ? (
            <Link href={`/${p.slug}`} className="hover-line">
              {p.fullName}
            </Link>
          ) : (
            p.fullName
          )}
        </span>
      ))}
    </>
  );
}
