import Image from 'next/image';
import Link from 'next/link';

import { shouldSkipOptimization } from '@/lib/blob';
import type { AiPoweredWork } from '@/lib/aiPoweredWorks';

interface AiWorkProjectNavProps {
  works: AiPoweredWork[];
  currentSlug: string;
  prevLabel: string;
  nextLabel: string;
  ariaLabel: string;
}

function navTitle(work: AiPoweredWork): string {
  return [work.brand, work.title].filter(Boolean).join(' — ') || work.brand;
}

function ProjectNavCard({
  work,
  label,
  direction,
}: {
  work: AiPoweredWork;
  label: string;
  direction: 'prev' | 'next';
}) {
  const align = direction === 'next' ? 'sm:items-end sm:text-right' : 'sm:items-start sm:text-left';

  return (
    <Link
      href={`/ai-powered/works/${work.slug}`}
      prefetch={false}
      className={`group editorial-panel flex flex-col gap-4 border-th-fg/10 p-4 transition-colors hover:border-th-fg/25 sm:p-5 ${align}`}
    >
      <span className="text-[10px] tracking-[0.35em] uppercase text-th-fg/40 group-hover:text-th-fg/70 transition-colors">
        {direction === 'prev' ? `← ${label}` : `${label} →`}
      </span>
      <div
        className={`relative aspect-[16/10] w-full max-w-[280px] overflow-hidden bg-th-fg/[0.04] ${
          direction === 'next' ? 'sm:ml-auto' : ''
        }`}
      >
        <Image
          src={work.imageSrc}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, 280px"
          className="object-cover transition-transform duration-[var(--duration-hover)] ease-snappy group-hover:scale-[1.03]"
          unoptimized={shouldSkipOptimization(work.imageSrc)}
        />
      </div>
      <span className="text-base font-black tracking-tight leading-snug text-th-fg group-hover:text-th-fg">
        {navTitle(work)}
      </span>
    </Link>
  );
}

export function AiWorkProjectNav({
  works,
  currentSlug,
  prevLabel,
  nextLabel,
  ariaLabel,
}: AiWorkProjectNavProps) {
  if (works.length < 2) return null;

  const index = works.findIndex((w) => w.slug === currentSlug);
  if (index < 0) return null;

  const prev = works[(index - 1 + works.length) % works.length];
  const next = works[(index + 1) % works.length];

  return (
    <nav className="mt-20 border-t border-th-fg/10 pt-12" aria-label={ariaLabel}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
        <ProjectNavCard work={prev} label={prevLabel} direction="prev" />
        <ProjectNavCard work={next} label={nextLabel} direction="next" />
      </div>
    </nav>
  );
}
