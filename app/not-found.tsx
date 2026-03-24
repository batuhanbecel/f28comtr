import Link from 'next/link';

export default function NotFound() {
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
          Error
        </p>

        {/* 404 */}
        <h1
          className="font-black text-th-fg leading-none mb-6"
          style={{ fontSize: 'clamp(7rem, 22vw, 16rem)', letterSpacing: '-0.04em' }}
        >
          404
        </h1>

        {/* Message */}
        <p className="text-th-fg/30 text-sm tracking-[0.15em] uppercase mb-12">
          This page could not be found
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-3 text-th-fg/50 text-[10px] tracking-[0.45em] uppercase hover:text-th-fg border border-th-fg/15 hover:border-th-fg/40 px-8 py-3.5 transition-all duration-300"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="square" d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to home
        </Link>
      </div>

      {/* Bottom label */}
      <p className="absolute bottom-10 text-th-fg/10 text-[9px] tracking-[0.5em] uppercase">
        f/2.8 Production Agency
      </p>
    </main>
  );
}
