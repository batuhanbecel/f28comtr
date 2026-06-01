'use client';

import { useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { EditorialButton } from '@/components/EditorialButton';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-th-bg text-th-fg flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.03,
          backgroundImage:
            'linear-gradient(rgb(var(--c-fg)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--c-fg)) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative">
        <PageHeader
          label="Something went wrong"
          title="Error"
          description="An unexpected error occurred"
          align="center"
          animate={false}
          gradient={false}
          className="[&_.heading-hero]:text-[clamp(4rem,14vw,10rem)] [&_.heading-hero]:leading-none [&_.heading-hero]:tracking-[-0.04em]"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <EditorialButton onClick={reset} variant="primary">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="square" d="M1 4v6h6M23 20v-6h-6" />
                <path d="M20.49 9A9 9 0 1 0 21.73 15" strokeLinecap="square" />
              </svg>
              Try again
            </EditorialButton>
            <EditorialButton href="/">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="square" d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Back to home
            </EditorialButton>
          </div>
        </PageHeader>
      </div>

      {/* Bottom label */}
      <p className="absolute bottom-10 section-label opacity-20">
        f/2.8 Production Agency
      </p>
    </main>
  );
}
