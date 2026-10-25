import { HeroLoadingSkeleton } from '@/components/HeroLoadingSkeleton';

export default function AiPoweredLoading() {
  return (
    <main className="bg-th-bg text-th-fg min-h-screen">
      <HeroLoadingSkeleton />
    </main>
  );
}
