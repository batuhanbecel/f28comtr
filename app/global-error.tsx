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
    <html lang="en">
      <body className="antialiased bg-black text-white">
        <main className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
          <div className="relative text-center">
            <p className="text-white/25 text-[10px] tracking-[0.55em] uppercase mt-6 mb-4">
              Something went wrong
            </p>
            <h1
              className="font-black text-white leading-none mb-6"
              style={{ fontSize: 'clamp(4rem, 14vw, 10rem)', letterSpacing: '-0.04em' }}
            >
              Error
            </h1>
            <p className="text-white/30 text-sm tracking-[0.15em] uppercase mb-12">
              An unexpected error occurred
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={reset}
                className="inline-flex items-center gap-3 text-white/70 text-[10px] tracking-[0.45em] uppercase hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 px-8 py-3.5 transition-all duration-300"
              >
                Try again
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-3 text-white/40 text-[10px] tracking-[0.45em] uppercase hover:text-white border border-white/10 hover:border-white/30 px-8 py-3.5 transition-all duration-300"
              >
                Back to home
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
