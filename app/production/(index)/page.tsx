import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { EditorialPageHero } from '@/components/EditorialPageHero';
import { HeroSnapBody } from '@/components/HeroSnapBody';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';
import { getProductionMarqueeItems, getPageCopy, getProductionProjects } from '@/lib/cms';
import { getServerLang } from '@/lib/serverLang';
import { generatePageMetadata } from '@/lib/seo';
import { ProductionMarquee } from '../components/ProductionMarquee';
import { ProductionProjectsGrid } from '../components/ProductionProjectsGrid';
import { ProductionSections } from '../components/ProductionSections';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('production', '/production');
}

export const revalidate = 60;

export default async function ProductionPage() {
  const lang = await getServerLang();
  const [copy, marqueeItems, projects] = await Promise.all([
    getPageCopy('production', lang),
    getProductionMarqueeItems(24),
    getProductionProjects(),
  ]);

  const heroCopy = {
    label: copy.sectionLabel,
    title: copy.heading,
    description: copy.description,
  };
  // The first roster image opens the page; the strip continues with the rest
  const [lead, ...rest] = marqueeItems;

  return (
    <ProductionSnapContainer>
      <EditorialPageHero
        page="production"
        lang={lang}
        heroCopy={heroCopy}
        media={lead ? { src: lead.src, alt: `${lead.photographerName} — ${copy.heading}` } : undefined}
      />
      <HeroSnapBody className="bg-th-bg text-th-fg">
        {/* Work first: case studies (when published in Studio) and the roster's work, then services and process */}
        <ProductionProjectsGrid
          projects={projects}
          label={copy.projectsLabel}
          heading={copy.projectsHeading}
        />
        <ProductionMarquee items={rest} copy={copy} />
        <ProductionSections copy={copy} />
        <Footer />
      </HeroSnapBody>
    </ProductionSnapContainer>
  );
}
