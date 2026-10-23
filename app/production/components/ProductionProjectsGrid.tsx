import { BlockHead } from '@/components/gallery/BlockHead';
import { Tile } from '@/components/gallery/Tile';
import { PROJECT_GRID_SIZES } from '@/lib/imageSizes';
import { ViewTransition } from '@/lib/ViewTransition';
import type { ProductionProject } from '@/lib/cms';

interface ProductionProjectsGridProps {
  projects: ProductionProject[];
  label: string;
  heading: string;
}

/** Production case studies — edge-to-edge 2-up landscape tiles. */
export function ProductionProjectsGrid({ projects, label, heading }: ProductionProjectsGridProps) {
  if (projects.length === 0) return null;

  return (
    <section className="g-section g-section--flush" aria-labelledby="production-projects-title">
      <BlockHead id="production-projects-title" label={label} title={heading} />
      <ul className="bleed-grid" style={{ '--cols-sm': 1, '--cols-md': 2, '--cols-lg': 2 } as React.CSSProperties}>
        {projects.map((project, i) => (
          <li key={project.id}>
            <Tile
              href={`/production/works/${project.slug}`}
              src={project.imageSrc}
              alt={project.imageAlt}
              sizes={PROJECT_GRID_SIZES}
              title={project.title}
              meta={[project.brand, project.year].filter(Boolean).join(' · ')}
              ratio="4 / 3"
              eager={i < 2}
              wrapImage={(image) => (
                <ViewTransition name={`production-project-${project.slug}`}>{image}</ViewTransition>
              )}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
