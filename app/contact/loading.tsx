import { HeroLoadingSkeleton } from '@/components/HeroLoadingSkeleton';
import { PageSection } from '@/components/PageSection';

export default function ContactLoading() {
  return (
    <main className="min-h-screen bg-th-bg">
      <HeroLoadingSkeleton />
      <PageSection className="contact-page pb-20 md:pb-28">
        <div className="contact-layout">
          <div className="contact-layout__channels space-y-6">
            <div className="h-3 w-32 bg-th-fg/10 animate-pulse rounded-sm" />
            <div className="h-10 w-2/3 max-w-sm bg-th-fg/[0.06] animate-pulse" />
            <div className="space-y-4 pt-4 border-t border-th-fg/10">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 bg-th-fg/[0.04] animate-pulse" />
              ))}
            </div>
          </div>
          <div className="contact-layout__form contact-form-wrap space-y-6">
            <div className="h-3 w-28 bg-th-fg/10 animate-pulse rounded-sm" />
            <div className="h-10 w-1/2 max-w-xs bg-th-fg/[0.06] animate-pulse" />
            <div className="grid gap-4 sm:grid-cols-2 pt-4">
              <div className="h-12 bg-th-fg/[0.04] animate-pulse sm:col-span-1" />
              <div className="h-12 bg-th-fg/[0.04] animate-pulse sm:col-span-1" />
              <div className="h-12 bg-th-fg/[0.04] animate-pulse sm:col-span-2" />
              <div className="h-32 bg-th-fg/[0.04] animate-pulse sm:col-span-2" />
            </div>
          </div>
        </div>
      </PageSection>
    </main>
  );
}
