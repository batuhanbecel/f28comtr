import { HeroLoadingSkeleton } from '@/components/HeroLoadingSkeleton';

export default function ContactLoading() {
  return (
    <main className="bg-th-bg text-th-fg min-h-screen" aria-hidden="true">
      <HeroLoadingSkeleton />
      <section className="g-section">
        <div className="g-inner space-y-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-12 md:h-14 border-b border-th-fg/[0.08] bg-th-fg/[0.03] animate-pulse" />
          ))}
        </div>
      </section>
    </main>
  );
}
