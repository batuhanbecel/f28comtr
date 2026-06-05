import Image from 'next/image';
import Link from 'next/link';

import { shouldSkipOptimization } from '@/lib/blob';
import type { AiPoweredWork } from '@/lib/aiPoweredWorks';
import { ViewTransition } from '@/lib/ViewTransition';

interface AiWorkProjectNavProps {
  works: AiPoweredWork[];
  currentSlug: string;
  prevLabel: string;
  nextLabel: string;
  ariaLabel: string;
  sectionLabel: string;
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
  const align =
    direction === 'next'
      ? 'sm:items-end sm:text-right sm:ml-auto'
      : 'sm:items-start sm:text-left';

  return (
    <Link
      href={`/ai-powered/works/${work.slug}`}
      prefetch={false}
      className={`group card-editorial flex w-full max-w-md flex-col gap-4 p-4 transition-[outline-color,box-shadow] duration-[var(--duration-hover)] sm:p-5 ${align}`}
    >
      <span className="section-label text-th-fg/40 transition-colors duration-ui group-hover:text-th-fg/70">
        {direction === 'prev' ? `← ${label}` : `${label} →`}
      </span>
      <div
        className={`relative aspect-[16/10] w-full overflow-hidden bg-th-fg/[0.04] ${
          direction === 'next' ? 'sm:max-w-[280px]' : 'sm:max-w-[280px]'
        }`}
      >
        <ViewTransition name={`ai-work-${work.slug}`}>
          <div className="relative h-full w-full">
            <Image
              src={work.imageSrc}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, 280px"
              className="object-cover thumb-hover-scale"
              unoptimized={shouldSkipOptimization(work.imageSrc)}
            />
          </div>
        </ViewTransition>
      </div>
      <span className="heading-section text-base leading-snug">{navTitle(work)}</span>
    </Link>
  );
}

export function AiWorkProjectNav({
  works,
  currentSlug,
  prevLabel,
  nextLabel,
  ariaLabel,
  sectionLabel,
}: AiWorkProjectNavProps) {
  if (works.length < 2) return null;

  const index = works.findIndex((w) => w.slug === currentSlug);
  if (index < 0) return null;

  const prev = works[(index - 1 + works.length) % works.length];
  const next = works[(index + 1) % works.length];

  return (
    <nav
      className="page-section--border mt-4 border-t border-th-fg/10 pt-12 md:pt-16"
      aria-label={ariaLabel}
    >
      <p className="section-label section-label--pill mb-8">{sectionLabel}</p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
        <ProjectNavCard work={prev} label={prevLabel} direction="prev" />
        <ProjectNavCard work={next} label={nextLabel} direction="next" />
      </div>
    </nav>
  );
}
