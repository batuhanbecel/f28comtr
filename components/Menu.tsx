'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { contactInfo } from '@/lib/data';

export function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6 md:p-8 transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-md bg-black/30' : ''
      }`}>
        <Link href="/" className="z-50">
          <Image
            src="/logos/f28/f28_white.png"
            alt="f/2.8"
            width={120}
            height={60}
            className="h-12 w-auto"
            priority
          />
        </Link>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="z-50 flex flex-col gap-1.5 w-8 h-8 items-center justify-center"
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0">
          <Image
            src="/menubg.webp"
            alt="Menu background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative h-full flex flex-col items-center justify-center text-white px-6">
          <div className="space-y-6 md:space-y-8 text-center mb-20">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block text-4xl md:text-6xl lg:text-7xl font-light tracking-wider hover:opacity-70 transition-opacity"
            >
              HOME
            </Link>
            <Link
              href="/portfolios"
              onClick={() => setIsOpen(false)}
              className="block text-4xl md:text-6xl lg:text-7xl font-light tracking-wider hover:opacity-70 transition-opacity"
            >
              PORTFOLIOS
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="block text-4xl md:text-6xl lg:text-7xl font-light tracking-wider hover:opacity-70 transition-opacity"
            >
              ABOUT US
            </Link>
          </div>

          <div className="absolute bottom-8 md:bottom-12 left-0 right-0 px-6">
            <div className="max-w-2xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 text-center md:text-left glass-effect p-6 rounded-lg">
                <div className="space-y-3">
                  <h3 className="text-xs tracking-[0.4em] mb-2 opacity-60 uppercase">Contact</h3>
                  <a 
                    href={`mailto:${contactInfo.email}`}
                    className="block text-base md:text-lg hover:opacity-70 transition-opacity"
                  >
                    {contactInfo.email}
                  </a>
                  <p className="text-sm md:text-base opacity-80 leading-relaxed">
                    {contactInfo.address}<br/>
                    {contactInfo.city}
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xs tracking-[0.4em] mb-2 opacity-60 uppercase">Follow Us</h3>
                  <div className="flex gap-3 justify-center md:justify-start">
                    <Link 
                      href={contactInfo.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 glass-effect rounded-lg hover-lift"
                    >
                      <Image
                        src="/logos/social/instagram.svg"
                        alt="Instagram"
                        width={24}
                        height={24}
                        className="w-6 h-6 filter brightness-0 invert"
                      />
                    </Link>
                    <Link 
                      href={contactInfo.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 glass-effect rounded-lg hover-lift"
                    >
                      <Image
                        src="/logos/social/linkedin.svg"
                        alt="LinkedIn"
                        width={24}
                        height={24}
                        className="w-6 h-6 filter brightness-0 invert"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
