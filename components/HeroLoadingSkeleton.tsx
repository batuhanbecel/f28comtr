import { F28LogoMark } from '@/components/F28LogoMark';

/** Matches EditorialPageHero layout — logo pulse + skeleton lines (Server Component for loading.tsx). */
export function HeroLoadingSkeleton({ maxWidth = 'max-w-5xl' }: { maxWidth?: string }) {
  return (
    <section className="hero-screen h-screen flex flex-col items-center justify-center px-6 md:px-12">
      <div className={`flex flex-col items-center gap-8 w-full ${maxWidth}`}>
        <F28LogoMark width={160} className="text-th-fg opacity-60 animate-pulse" aria-hidden />

        <div className="flex flex-col items-center gap-4 w-full mt-4">
          <div className="h-3 w-40 bg-th-fg/10 animate-pulse rounded-sm" />
          <div className="h-16 md:h-20 w-3/4 max-w-xl bg-th-fg/[0.06] animate-pulse" />
          <div className="h-2.5 w-full max-w-lg bg-th-fg/[0.04] animate-pulse" />
          <div className="h-2.5 w-4/5 max-w-lg bg-th-fg/[0.03] animate-pulse" />
        </div>
      </div>
    </section>
  );
}
