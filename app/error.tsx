'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
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

      <div className="relative text-center">
        {/* Rule */}
        <div className="hero-rule mx-auto" />

        {/* Label */}
        <p className="text-th-fg/25 text-[10px] tracking-[0.55em] uppercase mt-6 mb-4">
          Something went wrong
        </p>

        {/* Title */}
        <h1
          className="font-black text-th-fg leading-none mb-6"
          style={{ fontSize: 'clamp(4rem, 14vw, 10rem)', letterSpacing: '-0.04em' }}
        >
          Error
        </h1>

        {/* Message */}
        <p className="text-th-fg/30 text-sm tracking-[0.15em] uppercase mb-12">
          An unexpected error occurred
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center gap-3 text-th-fg/70 text-[10px] tracking-[0.45em] uppercase hover:text-th-fg bg-th-fg/5 hover:bg-th-fg/10 border border-th-fg/15 hover:border-th-fg/30 px-8 py-3.5 transition-all duration-300"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="square" d="M1 4v6h6M23 20v-6h-6" />
              <path d="M20.49 9A9 9 0 1 0 21.73 15" strokeLinecap="square" />
            </svg>
            Try again
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-3 text-th-fg/40 text-[10px] tracking-[0.45em] uppercase hover:text-th-fg border border-th-fg/10 hover:border-th-fg/30 px-8 py-3.5 transition-all duration-300"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="square" d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to home
          </Link>
        </div>
      </div>

      {/* Bottom label */}
      <p className="absolute bottom-10 text-th-fg/10 text-[9px] tracking-[0.5em] uppercase">
        f/2.8 Production Agency
      </p>
    </main>
  );
}
