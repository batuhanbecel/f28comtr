'use client';

import { useRef, useEffect } from 'react';
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
}

export function ParallaxSection({ photographer, index }: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

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

  return (
    <section
      ref={sectionRef}
      className="relative h-[66vh] w-full flex items-center overflow-hidden"
    >
      <div ref={imageRef} className="absolute -inset-y-[10%] inset-x-0 w-full h-[120%] parallax-image bg-gray-900">
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
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50" />
      
      <div className="relative z-10 text-white px-6 md:px-16 lg:px-24 max-w-7xl w-full">
        <div className="space-y-4 md:space-y-6">
          <p className="label-text opacity-90 fade-in-up" style={{animationDelay: '0.1s'}}>
            {photographer.title}
          </p>
          <h2 className="heading-hero mb-6 md:mb-8 fade-in-up" style={{animationDelay: '0.2s'}}>
            {photographer.fullName}
          </h2>
          <Link
            href={`/portfolio/${photographer.id}`}
            className="group inline-flex items-center gap-3 md:gap-4 label-text relative px-4 md:px-6 py-2.5 md:py-3 border border-white/30 hover:border-white/60 transition-all duration-500 hover:bg-white/10 backdrop-blur-sm fade-in-up"
            style={{animationDelay: '0.3s'}}
          >
            <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
              VIEW PORTFOLIO
            </span>
            <svg 
              className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
