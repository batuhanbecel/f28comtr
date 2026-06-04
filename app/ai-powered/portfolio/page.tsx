import type { Metadata } from 'next';
import { getAiPoweredPortfolio } from '@/lib/cms';
import { getServerLang } from '@/lib/serverLang';
import { AiPoweredPortfolioGallery } from './AiPoweredPortfolioGallery';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('aiPoweredPortfolio', '/ai-powered/portfolio');
}

export const revalidate = 60;

export default async function AiPoweredPortfolioPage() {
  const [portfolio, lang] = await Promise.all([getAiPoweredPortfolio(), getServerLang()]);
  return <AiPoweredPortfolioGallery portfolio={portfolio} lang={lang} />;
}
