import { MasonryGridSkeleton } from '@/components/MasonryGridSkeleton';

export default function AIBasedLoading() {
  return (
    <main className="min-h-screen bg-th-bg">
      <section className="hero-screen min-h-screen flex flex-col items-center justify-center section-padding">
        <div className="page-heading-stack page-heading-stack--center gap-5 w-full max-w-4xl">
          <div className="hero-rule mx-auto animate-pulse opacity-30" />
          <div className="h-6 w-32 editorial-panel animate-pulse mx-auto" />
          <div className="h-16 md:h-24 w-64 md:w-80 editorial-panel animate-pulse mx-auto" />
          <div className="h-2.5 w-full max-w-lg editorial-panel animate-pulse mt-4 mx-auto" />
        </div>
      </section>
      <section className="page-section max-w-7xl mx-auto px-6">
        <MasonryGridSkeleton />
      </section>
    </main>
  );
}
