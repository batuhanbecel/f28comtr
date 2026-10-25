import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AiWorkGalleryColumn } from '@/app/ai-powered/components/AiWorkGalleryColumn';
import { CaseHero, NextWork, type CaseMetaItem } from '@/components/CaseStudy';
import { Footer } from '@/components/Footer';
import { getProductionProjects, type ProductionProject } from '@/lib/cms';
import type { CreditPerson } from '@/lib/aiPoweredWorks';
import { getServerLang } from '@/lib/serverLang';
import { absoluteUrl } from '@/lib/siteUrl';
import type { Lang } from '@/lib/translations';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;
// The page reads the language cookie. With no published projects
// generateStaticParams is empty, the build can't see that and marks the route
// static — unknown slugs then 500 (DYNAMIC_SERVER_USAGE) instead of 404.
export const dynamic = 'force-dynamic';

const LABELS: Record<Lang, Record<string, string>> = {
  en: {
    back: 'Production',
    client: 'Client',
    agency: 'Agency',
    year: 'Year',
    photographers: 'Photography',
    retouchers: 'Retouch',
    nav: 'Project navigation',
    prev: 'Previous project',
    next: 'Next project',
  },
  tr: {
    back: 'Prodüksiyon',
    client: 'Müşteri',
    agency: 'Ajans',
    year: 'Yıl',
    photographers: 'Fotoğraf',
    retouchers: 'Rötuş',
    nav: 'Projeler arası gezinme',
    prev: 'Önceki proje',
    next: 'Sonraki proje',
  },
};

function describe(project: ProductionProject, lang: Lang) {
  return project.description[lang] || project.description.en || project.description.tr || '';
}

export async function generateStaticParams() {
  const projects = await getProductionProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  // 404 before reading the language cookie: unknown slugs render as ISR, where
  // cookies() throws DYNAMIC_SERVER_USAGE and the response becomes a 500
  const project = (await getProductionProjects()).find((p) => p.slug === slug);
  if (!project) notFound();
  const lang = await getServerLang();

  const title = `${project.brand} — ${project.title}`;
  const description = describe(project, lang) || `${project.brand} · Production by f/2.8`;
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/production/works/${slug}`) },
    openGraph: {
      title,
      description,
      images: [{ url: project.imageSrc }],
      url: absoluteUrl(`/production/works/${slug}`),
    },
  };
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

export default async function ProductionProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const projects = await getProductionProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const lang = await getServerLang();

  const project = projects[index];
  const prev = index > 0 ? projects[index - 1] : null;
  // The last project hands over to the first
  const next = projects.length > 1 ? projects[(index + 1) % projects.length] : null;
  const l = LABELS[lang];
  const description = describe(project, lang);

  // Client sits above the title, so it isn't repeated in the credits row
  const meta: CaseMetaItem[] = [
    ...(project.agency ? [{ label: l.agency, value: project.agency }] : []),
    ...(project.year ? [{ label: l.year, value: String(project.year) }] : []),
    ...(project.photographers.length ? [{ label: l.photographers, value: <People people={project.photographers} /> }] : []),
    ...(project.retouchers.length ? [{ label: l.retouchers, value: <People people={project.retouchers} /> }] : []),
  ];

  return (
    <>
      <main className="min-h-screen bg-th-bg text-th-fg">
        <CaseHero
          back={{ href: '/production', label: l.back }}
          eyebrow={project.brand}
          title={project.title}
          description={description || undefined}
          meta={meta}
        />

        <AiWorkGalleryColumn
          workSlug={project.slug}
          images={project.images}
          imageAlt={project.imageAlt}
          transitionPrefix="production-project"
        />

        {next ? (
          <NextWork
            ariaLabel={l.nav}
            prev={prev ? { href: `/production/works/${prev.slug}`, label: l.prev, title: prev.title } : null}
            next={{
              href: `/production/works/${next.slug}`,
              label: l.next,
              title: `${next.brand} — ${next.title}`,
              imageSrc: next.imageSrc,
              imageAlt: next.imageAlt,
            }}
          />
        ) : null}
      </main>
      <Footer />
    </>
  );
}
