import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal } from '@/components/ScrollReveal';
import { DisplayCase } from '@/components/DisplayCase';
import { shouldSkipOptimization } from '@/lib/blob';
import { GRID_IMAGE_QUALITY } from '@/lib/imageConfig';
import { EDITORIAL_FEATURE_SIZES, EDITORIAL_TILE_SIZES } from '@/lib/imageSizes';
import { ViewTransition } from '@/lib/ViewTransition';
import type { ProductionProject } from '@/lib/cms';

interface ProductionProjectsGridProps {
  projects: ProductionProject[];
  label: string;
  heading: string;
}

/** Production case studies — wide editorial frames (the production side's rhythm). */
export function ProductionProjectsGrid({ projects, label, heading }: ProductionProjectsGridProps) {
  if (projects.length === 0) return null;

  return (
    <section className="selected-works page-section" aria-labelledby="production-projects-title">
      <ScrollReveal className="selected-works__head">
        <div className="page-heading-stack">
          <span className="section-label">{label}</span>
          <h2 id="production-projects-title" className="heading-section">
            <DisplayCase>{heading}</DisplayCase>
          </h2>
        </div>
      </ScrollReveal>

      <ol className="selected-works__grid">
        {projects.map((project, i) => {
          const feature = i % 6 === 0 || i % 6 === 5;
          return (
            <li key={project.id} className={`selected-works__item ${feature ? 'is-feature' : ''}`}>
              <ScrollReveal delay={0.04 + (i % 3) * 0.06}>
                <Link href={`/production/works/${project.slug}`} className="group block">
                  <div className={`selected-works__frame ${feature ? 'aspect-[4/3]' : 'aspect-[4/5]'}`}>
                    <ViewTransition name={`production-project-${project.slug}`}>
                      <Image
                        src={project.imageSrc}
                        alt={project.imageAlt}
                        fill
                        className="object-cover thumb-hover-scale"
                        sizes={feature ? EDITORIAL_FEATURE_SIZES : EDITORIAL_TILE_SIZES}
                        loading={i < 2 ? 'eager' : 'lazy'}
                        quality={GRID_IMAGE_QUALITY}
                        unoptimized={shouldSkipOptimization(project.imageSrc)}
                      />
                    </ViewTransition>
                  </div>
                  <div className="selected-works__credit">
                    <span className="selected-works__index">{String(i + 1).padStart(2, '0')}</span>
                    <span className="min-w-0">
                      <span className="selected-works__title">{project.title}</span>
                      <span className="selected-works__meta">
                        {[project.brand, project.year].filter(Boolean).join(' · ')}
                      </span>
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
