'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { HeroSnapTarget } from '@/components/HeroSnapTarget';

const SET_GAP_PX = 12;

interface HomeV2ServicesMarqueeProps {
  label: string;
  items: string[];
}

function repeatItems<T>(items: T[], times: number): T[] {
  if (times <= 1) return items;
  return Array.from({ length: times }, () => items).flat();
}

function ServiceChipSet({
  items,
  setKey,
  cycleLength,
}: {
  items: string[];
  setKey: string;
  cycleLength: number;
}) {
  return (
    <>
      {items.map((title, i) => (
        <span key={`${setKey}-${i}-${title}`} className="home-v2-services-chip editorial-chip">
          <span className="mono-label">{String((i % cycleLength) + 1).padStart(2, '0')}</span>
          {title}
        </span>
      ))}
    </>
  );
}

export function HomeV2ServicesMarquee({ label, items }: HomeV2ServicesMarqueeProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const cycleProbeRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);
  const secondSetRef = useRef<HTMLDivElement>(null);
  const [repeatCount, setRepeatCount] = useState(2);
  const [shiftPx, setShiftPx] = useState<number | null>(null);

  const loopItems = useMemo(() => repeatItems(items, repeatCount), [items, repeatCount]);
  const durationSec = Math.max(48, loopItems.length * 4.5);

  useLayoutEffect(() => {
    const row = rowRef.current;
    const probe = cycleProbeRef.current;
    if (!row || !probe || items.length === 0) return;

    const updateRepeats = () => {
      const viewport = row.clientWidth;
      const cycleWidth = probe.offsetWidth;
      if (viewport <= 0 || cycleWidth <= 0) return;

      const next = Math.max(2, Math.ceil(viewport / cycleWidth) + 1);
      setRepeatCount((prev) => (prev === next ? prev : next));
    };

    updateRepeats();

    const observer = new ResizeObserver(updateRepeats);
    observer.observe(row);
    observer.observe(probe);

    window.addEventListener('load', updateRepeats);
    return () => {
      observer.disconnect();
      window.removeEventListener('load', updateRepeats);
    };
  }, [items]);

  useLayoutEffect(() => {
    const first = firstSetRef.current;
    const second = secondSetRef.current;
    if (!first || !second) return;

    const updateShift = () => {
      const shift = second.offsetLeft;
      if (shift > 0) {
        setShiftPx(Math.round(shift));
        return;
      }
      setShiftPx(Math.round(first.offsetWidth + SET_GAP_PX));
    };

    updateShift();

    const observer = new ResizeObserver(updateShift);
    observer.observe(first);
    observer.observe(second);

    window.addEventListener('load', updateShift);
    return () => {
      observer.disconnect();
      window.removeEventListener('load', updateShift);
    };
  }, [items, repeatCount]);

  if (items.length === 0) return null;

  return (
    <HeroSnapTarget className="hero-snap-target--pad">
      <section className="home-v2-services-marquee w-full" aria-label={label}>
        <div ref={rowRef} className="home-v2-services-marquee-row w-full">
          <div ref={cycleProbeRef} className="home-v2-services-marquee-probe" aria-hidden>
            <ServiceChipSet items={items} setKey="probe" cycleLength={items.length} />
          </div>

          <div
            className="home-v2-services-marquee-track"
            data-ready={shiftPx != null ? 'true' : undefined}
            style={
              shiftPx != null
                ? ({
                    '--marquee-shift': `${shiftPx}px`,
                    '--marquee-duration': `${durationSec}s`,
                  } as React.CSSProperties)
                : undefined
            }
          >
            <div ref={firstSetRef} className="home-v2-services-marquee-set">
              <ServiceChipSet items={loopItems} setKey="a" cycleLength={items.length} />
            </div>
            <div ref={secondSetRef} className="home-v2-services-marquee-set" aria-hidden>
              <ServiceChipSet items={loopItems} setKey="b" cycleLength={items.length} />
            </div>
          </div>
        </div>
      </section>
    </HeroSnapTarget>
  );
}
