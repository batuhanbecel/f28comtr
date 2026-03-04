'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ParallaxSectionProps {
  photographer: {
    id: string;
    fullName: string;
    title: string;
    preview: string;
  };
  index: number;
  total?: number;
}

export function ParallaxSection({ photographer, index, total }: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [textVisible, setTextVisible] = useState(false);
  const isRight = index % 2 === 1;

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!sectionRef.current || !imageRef.current) {
            ticking = false;
            return;
          }

          const rect = sectionRef.current.getBoundingClientRect();
          const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          
          if (scrollProgress >= 0 && scrollProgress <= 1) {
            const intensity = window.innerWidth < 768 ? 80 : 200;
            const translateY = (scrollProgress - 0.5) * intensity;
            imageRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`;
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTextVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const numLabel = String(index + 1).padStart(2, '0');
  const totalLabel = total ? String(total).padStart(2, '0') : '';

  return (
    <section
      ref={sectionRef}
      className="relative h-[66vh] w-full flex items-center overflow-hidden"
    >
      <div ref={imageRef} className="absolute -inset-y-[10%] inset-x-0 w-full h-[120%] parallax-image bg-black">
        <Image
          src={photographer.preview}
          alt={photographer.fullName}
          fill
          className="object-cover object-center"
          priority={index === 0}
          loading="eager"
          sizes="100vw"
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      </div>

      {/* Directional overlay — stronger on text side */}
      <div className={`absolute inset-0 ${
        isRight
          ? 'bg-gradient-to-l from-black/80 via-black/50 to-black/20'
          : 'bg-gradient-to-r from-black/80 via-black/50 to-black/20'
      }`} />

      {/* Index number — large faded background numeral */}
      <div className={`absolute bottom-4 md:bottom-6 ${
        isRight ? 'left-6 md:left-12' : 'right-6 md:right-12'
      } select-none pointer-events-none`}>
        <span className="text-white/[0.06] font-black" style={{ fontSize: 'clamp(5rem, 15vw, 12rem)', lineHeight: 1, letterSpacing: '-0.04em' }}>
          {numLabel}
        </span>
      </div>

      {/* Text content — alternates left/right */}
      <div
        ref={textRef}
        className={`relative z-10 text-white w-full px-6 md:px-16 lg:px-24 ${
          isRight ? 'flex justify-end' : ''
        }`}
      >
        <div className={`max-w-2xl ${ isRight ? 'text-right' : '' }`}>

          {/* Label row: title + counter on same line */}
          <div
            className={`flex items-center gap-4 mb-5 md:mb-7 ${ isRight ? 'justify-end' : '' }`}
            style={{
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.55s cubic-bezier(0.76,0,0.24,1) 0s, transform 0.55s cubic-bezier(0.76,0,0.24,1) 0s',
            }}
          >
            <span className="label-text opacity-70">{photographer.title}</span>
            <span className="text-white/15 text-[10px] font-mono tracking-widest">
              {numLabel}{totalLabel && ` / ${totalLabel}`}
            </span>
          </div>

          {/* Photographer name */}
          <h2
            className="heading-hero mb-8 md:mb-10"
            style={{
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.6s cubic-bezier(0.76,0,0.24,1) 0.15s, transform 0.6s cubic-bezier(0.76,0,0.24,1) 0.15s',
              paddingTop: '0.1em',
            }}
          >
            {photographer.fullName}
          </h2>

          {/* CTA */}
          <div
            style={{
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.55s cubic-bezier(0.76,0,0.24,1) 0.3s, transform 0.55s cubic-bezier(0.76,0,0.24,1) 0.3s',
            }}
          >
            <Link
              href={`/portfolio/${photographer.id}`}
              className="group inline-flex items-center gap-3 md:gap-4 label-text px-5 md:px-7 py-3 border border-white/25 hover:border-white/55 transition-all duration-500 hover:bg-white/10"
            >
              {isRight && (
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
              )}
              <span className={`transition-transform duration-300 ${ isRight ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1' }`}>
                VIEW PORTFOLIO
              </span>
              {!isRight && (
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              )}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
