import { getPhotographers } from '@/lib/db';
import { PortfoliosList } from './PortfoliosList';

export const revalidate = 60;

export default async function PortfoliosPage() {
  const photographers = await getPhotographers();
  return <PortfoliosList photographers={photographers} />;
}
