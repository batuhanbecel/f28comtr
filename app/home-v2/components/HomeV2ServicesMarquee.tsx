'use client';

interface HomeV2ServicesMarqueeProps {
  label: string;
  items: string[];
}

export function HomeV2ServicesMarquee({ label, items }: HomeV2ServicesMarqueeProps) {
  if (items.length === 0) return null;

  const loop = [...items, ...items, ...items, ...items];

  return (
    <section className="home-v2-services-marquee w-full" aria-label={label}>
      <div className="home-v2-services-marquee-row w-full overflow-hidden">
        <div className="home-v2-services-marquee-track home-v2-services-marquee-track--forward">
          {loop.map((title, i) => (
            <span key={`${title}-${i}`} className="home-v2-services-chip editorial-chip">
              <span className="mono-label">{String((i % items.length) + 1).padStart(2, '0')}</span>
              {title}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
