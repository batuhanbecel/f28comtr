import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AiWorkGalleryColumn } from '@/app/ai-powered/components/AiWorkGalleryColumn';
import { Footer } from '@/components/Footer';
import { getProductionProjects, type ProductionProject } from '@/lib/cms';
import type { CreditPerson } from '@/lib/aiPoweredWorks';
import { getServerLang } from '@/lib/serverLang';
import { absoluteUrl } from '@/lib/siteUrl';
import { translations, type Lang } from '@/lib/translations';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

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
  const [projects, lang] = await Promise.all([getProductionProjects(), getServerLang()]);
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: { absolute: translations[lang].seo.notFound.title }, robots: { index: false } };

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
  const [projects, lang] = await Promise.all([getProductionProjects(), getServerLang()]);
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const prev = index > 0 ? projects[index - 1] : null;
  const next = index < projects.length - 1 ? projects[index + 1] : null;
  const l = LABELS[lang];
  const description = describe(project, lang);

  const meta: { label: string; value: React.ReactNode }[] = [
    { label: l.client, value: project.brand },
    ...(project.agency ? [{ label: l.agency, value: project.agency }] : []),
    ...(project.year ? [{ label: l.year, value: String(project.year) }] : []),
    ...(project.photographers.length ? [{ label: l.photographers, value: <People people={project.photographers} /> }] : []),
    ...(project.retouchers.length ? [{ label: l.retouchers, value: <People people={project.retouchers} /> }] : []),
  ];

  return (
    <>
      <main className="min-h-screen bg-th-bg text-th-fg">
        <header className="editorial-hero">
          <div className="editorial-hero__inner">
            <div className="editorial-hero__title">
              <Link href="/production" className="section-label transition-opacity duration-ui hover:opacity-100">
                {l.back}
              </Link>
              <h1 className="heading-hero">{project.title}</h1>
            </div>
            <div className="flex flex-col gap-8">
              {description ? <p className="body-text text-muted-body max-w-[34rem]">{description}</p> : null}
              <dl className="project-meta">
                {meta.map((row) => (
                  <div key={row.label} className="project-meta__row">
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </header>

        <section className="page-section">
          <div className="mx-auto max-w-6xl">
            <AiWorkGalleryColumn
              workSlug={project.slug}
              images={project.images}
              imageAlt={project.imageAlt}
              transitionPrefix="production-project"
            />
          </div>
        </section>

        {prev || next ? (
          <nav aria-label={l.nav} className="page-section page-section--border">
            <div className="project-nav">
              {prev ? (
                <Link href={`/production/works/${prev.slug}`} className="project-nav__link group">
                  <span className="text-sm text-th-fg/72">← {l.prev}</span>
                  <span className="heading-lg group-hover:underline underline-offset-4 decoration-1">{prev.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link href={`/production/works/${next.slug}`} className="project-nav__link project-nav__link--next group">
                  <span className="text-sm text-th-fg/72">{l.next} →</span>
                  <span className="heading-lg group-hover:underline underline-offset-4 decoration-1">{next.title}</span>
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
