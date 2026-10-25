import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { AiWorkGalleryColumn } from '@/app/ai-powered/components/AiWorkGalleryColumn';
import { AiWorkProjectNav } from '@/app/ai-powered/components/AiWorkProjectNav';
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
          moreWorks: 'Diğer çalışmalar',
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
          moreWorks: 'More works',
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

  // Brand shows once: as the eyebrow when the work has its own title, else as the title
  const heading = (
    <header className="page-heading-stack gap-3">
      <Link
        href="/ai-powered"
        prefetch={false}
        className="section-label transition-opacity duration-ui hover:opacity-100"
      >
        ← {labels.back}
      </Link>
      {work.title ? <p className="text-muted-body">{work.brand}</p> : null}
      <h1 className="heading-section leading-tight">{work.title || work.brand}</h1>
    </header>
  );

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
      <main className="min-h-screen bg-th-bg text-th-fg pb-16 pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          {/* Phones: title, then the work itself, then the details */}
          <div className="mb-8 lg:hidden">{heading}</div>

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
            {/* Image column — large, uncropped, vertical */}
            <div className="min-w-0">
              <AiWorkGalleryColumn
                workSlug={slug}
                images={work.images}
                imageAlt={work.imageAlt || `${work.brand} — ${work.title}`}
              />
            </div>

            {/* Sticky info panel */}
            <aside className="self-start lg:sticky lg:top-24">
              <div className="space-y-8">
                <div className="hidden lg:block">{heading}</div>

                <dl className="project-meta">
                  {meta.map((row) => (
                    <div key={row.label} className="project-meta__row">
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ))}
                </dl>

                {work.description ? (
                  <p className="body-text whitespace-pre-line leading-relaxed text-muted-body">
                    {work.description}
                  </p>
                ) : null}

                {work.instagramUrl ? (
                  <a
                    href={work.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-editorial inline-flex"
                  >
                    {labels.instagram} ↗
                  </a>
                ) : null}
              </div>
            </aside>
          </div>

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
