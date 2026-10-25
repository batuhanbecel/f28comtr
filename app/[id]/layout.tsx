import { notFound } from 'next/navigation';
import { getPhotographers } from '@/lib/cms';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

/**
 * Unknown ids must 404 before `loading.tsx` starts the stream — once the
 * skeleton is flushed the status is locked at 200 (soft 404).
 */
export default async function PhotographerLayout({ children, params }: LayoutProps) {
  const { id } = await params;
  const photographers = await getPhotographers();
  if (!photographers.some((p) => p.id === id)) notFound();
  return children;
}
