import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="fixed inset-0 flex flex-col md:flex-row">

      {/* Production */}
      <Link
        href="/production"
        className="relative w-full md:w-1/2 h-1/2 md:h-full group overflow-hidden"
      >
        <Image
          src="/landing-1.webp"
          alt="Production"
          fill
          className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
          priority
          quality={90}
        />
        {/* Base overlay */}
        <div className="absolute inset-0 bg-black/50" />
        {/* Bottom-up gradient so text is always readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        {/* Hover lightening */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.04] transition-colors duration-700" />

        {/* Text block — bottom left */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16">
          <p className="text-white/40 text-[10px] tracking-[0.45em] uppercase mb-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            Photography &amp; Retouching
          </p>
          <h1 className="heading-hero text-white mb-5">
            PRODUCTION
          </h1>
          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-75">
            <span className="text-white/50 text-[10px] tracking-[0.35em] uppercase">Enter</span>
            <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="square" strokeLinejoin="miter" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </div>
        </div>

        {/* Right edge line on hover */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block" />
      </Link>

      {/* AI Based */}
      <Link
        href="/ai-based"
        className="relative w-full md:w-1/2 h-1/2 md:h-full group overflow-hidden"
      >
        <Image
          src="/landing-2.jpg"
          alt="AI Based"
          fill
          className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.04] transition-colors duration-700" />

        {/* Text block — bottom left */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16">
          <p className="text-white/40 text-[10px] tracking-[0.45em] uppercase mb-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            Artificial Intelligence &amp; Creativity
          </p>
          <h1 className="heading-hero text-white mb-5">
            AI BASED
          </h1>
          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-75">
            <span className="text-white/50 text-[10px] tracking-[0.35em] uppercase">Enter</span>
            <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="square" strokeLinejoin="miter" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </div>
        </div>

        {/* Left edge line on hover */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block" />
      </Link>

      {/* Center divider — vertical on desktop, horizontal on mobile */}
      <div className="absolute left-0 md:left-1/2 top-1/2 md:top-0 right-0 md:right-auto bottom-auto md:bottom-0 w-full md:w-px h-px md:h-full bg-gradient-to-r md:bg-gradient-to-b from-transparent via-white/20 to-transparent -translate-y-1/2 md:translate-y-0 md:-translate-x-1/2 pointer-events-none" />

      {/* Centered f/2.8 brand mark at divider — desktop only */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center pointer-events-none">
        <div className="bg-black/80 backdrop-blur-sm border border-white/10 px-4 py-3">
          <Image
            src="/logos/f28/f28_white.png"
            alt="f/2.8"
            width={56}
            height={28}
            className="h-6 w-auto opacity-50"
          />
        </div>
      </div>
    </main>
  );
}
