import type { Metadata } from 'next';
import { getPhotographers } from '@/lib/db';
import { PortfoliosList } from './PortfoliosList';

export const metadata: Metadata = {
  title: 'Portfolios | f/2.8 Production Agency',
  description: 'Browse portfolios from our talented photographers and retouchers.',
  openGraph: {
    title: 'Portfolios | f/2.8 Production Agency',
    description: 'Browse portfolios from our talented photographers and retouchers.',
    url: 'https://www.f28.com.tr/portfolios',
  },
};

export const revalidate = 60;

export default async function PortfoliosPage() {
  const photographers = await getPhotographers();
  return <PortfoliosList photographers={photographers} />;
}
