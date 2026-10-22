/** Matches EditorialPageHero — left title block, intro on the right (Server Component for loading.tsx). */
export function HeroLoadingSkeleton() {
  return (
    <section className="editorial-hero" aria-hidden="true">
      <div className="editorial-hero__inner">
        <div className="editorial-hero__title">
          <div className="h-3 w-32 bg-th-fg/10 animate-pulse" />
          <div className="h-16 md:h-24 w-3/4 max-w-xl bg-th-fg/[0.06] animate-pulse" />
        </div>
        <div className="flex flex-col gap-3 w-full max-w-[34rem]">
          <div className="h-3 w-full bg-th-fg/[0.05] animate-pulse" />
          <div className="h-3 w-11/12 bg-th-fg/[0.04] animate-pulse" />
          <div className="h-3 w-3/4 bg-th-fg/[0.03] animate-pulse" />
        </div>
      </div>
    </section>
  );
}
