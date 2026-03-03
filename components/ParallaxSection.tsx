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
            const translateY = (scrollProgress - 0.5) * 200;
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
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="relative z-10 text-white px-8 md:px-16 lg:px-24 max-w-7xl">
        <p className="text-base md:text-xl lg:text-2xl tracking-[0.3em] mb-4 font-black uppercase">
          {photographer.title}
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide mb-8 leading-tight">
          {photographer.fullName}
        </h2>
        <Link
          href={`/portfolio/${photographer.id}`}
          className="group inline-flex items-center gap-3 text-sm md:text-base lg:text-lg tracking-[0.3em] font-bold uppercase relative overflow-hidden"
        >
          <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
            SEE ALL
          </span>
          <svg 
            className="w-8 h-[1px] relative overflow-hidden" 
            viewBox="0 0 32 1"
          >
            <line 
              x1="0" 
              y1="0.5" 
              x2="32" 
              y2="0.5" 
              stroke="white" 
              strokeWidth="1"
              className="transition-all duration-300"
            />
            <line 
              x1="-32" 
              y1="0.5" 
              x2="0" 
              y2="0.5" 
              stroke="white" 
              strokeWidth="2"
              className="transition-transform duration-500 group-hover:translate-x-[32px]"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
