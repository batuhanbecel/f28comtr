import { MasonryGridSkeleton } from '@/components/MasonryGridSkeleton';

export default function PortfoliosLoading() {
  return (
    <main className="min-h-screen bg-th-bg">
      <section className="section-padding pb-8">
        <div className="page-header-block px-4 md:px-8 mb-10">
          <div className="page-heading-stack gap-4">
            <div className="hero-rule hero-rule--left animate-pulse opacity-30" />
            <div className="h-6 w-24 editorial-panel animate-pulse" />
            <div className="h-14 w-64 editorial-panel animate-pulse" />
          </div>
        </div>
        <MasonryGridSkeleton />
      </section>
    </main>
  );
}
