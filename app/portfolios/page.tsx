import type { Metadata } from 'next';
import { getPhotographers } from '@/lib/db';
import { getServerLang } from '@/lib/serverLang';
import { PortfoliosList } from './PortfoliosList';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('portfolios', '/portfolios');
}

export const revalidate = 60;

export default async function PortfoliosPage() {
  const [photographers, lang] = await Promise.all([getPhotographers(), getServerLang()]);
  return <PortfoliosList photographers={photographers} lang={lang} />;
}
