'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { contactInfo } from '@/lib/data';

export function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => setIsVisible(true), 20);
    } else {
      setIsVisible(false);
      setTimeout(() => document.body.style.overflow = 'unset', 600);
    }
  }, [isOpen]);

  const menuItems = [
    { href: '/', label: 'HOME' },
    { href: '/production', label: 'PRODUCTION' },
    { href: '/ai-based', label: 'AI BASED' },
    { href: '/about', label: 'ABOUT US' },
  ];

  return (
    <>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 md:p-8 transition-all duration-500 ${
        isScrolled ? 'backdrop-blur-xl bg-black/40 shadow-lg' : ''
      }`}>
        <Link href="/" className="relative z-50 transform transition-transform duration-300 hover:scale-105">
          <Image
            src="/logos/f28/f28_white.png"
            alt="f/2.8"
            width={120}
            height={60}
            className="h-9 md:h-12 w-auto"
            priority
          />
        </Link>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-50 w-12 h-12 flex items-center justify-center group"
          aria-label="Toggle menu"
        >
          <div className="absolute inset-0 border border-white/20 rounded-full scale-100 group-hover:scale-110 group-hover:border-white/40 transition-all duration-300" />
          <div className="relative flex flex-col gap-1.5 w-6">
            <span className={`h-0.5 bg-white rounded-full transition-all duration-700 ease-out ${
              isOpen ? 'rotate-45 translate-y-2' : ''
            }`} />
            <span className={`h-0.5 bg-white rounded-full transition-all duration-700 ${
              isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
            }`} />
            <span className={`h-0.5 bg-white rounded-full transition-all duration-700 ease-out ${
              isOpen ? '-rotate-45 -translate-y-2' : ''
            }`} />
          </div>
        </button>
      </header>

      {/* Fullscreen Menu - Wipe down/up like loader */}
      <div
        className={`fixed inset-0 z-40 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{
          clipPath: isVisible
            ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
            : 'polygon(0 0, 100% 0, 100% 0, 0 0)',
          transition: 'clip-path 0.6s cubic-bezier(0.76, 0, 0.24, 1)',
        }}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/menubg.webp"
            alt="Menu background"
            fill
            className="object-cover"
            priority
            quality={85}
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        {/* Menu Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-white px-6 py-8 md:p-8 overflow-y-auto">
          {/* Navigation Links */}
          <nav className="flex flex-col items-center space-y-5 md:space-y-8 mb-10 md:mb-16">
            {menuItems.map((item, index) => (
              <div
                key={item.href}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0px)' : 'translateY(40px)',
                  transition: isVisible
                    ? `opacity 0.5s ease ${index * 0.08 + 0.3}s, transform 0.5s ease ${index * 0.08 + 0.3}s`
                    : `opacity 0.2s ease ${(menuItems.length - 1 - index) * 0.04}s, transform 0.2s ease ${(menuItems.length - 1 - index) * 0.04}s`,
                }}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="group relative text-white block text-[2rem] sm:text-[2.5rem] md:text-[4rem] lg:text-[5rem] font-black tracking-tight leading-none"
                >
                  <span className="relative inline-block transition-transform duration-500 group-hover:translate-x-3">
                    <span className="relative z-10 transition-colors duration-500 group-hover:text-white/60">
                      {item.label}
                    </span>
                    {/* Underline */}
                    <span className="absolute -bottom-2 left-0 h-0.5 w-0 bg-white group-hover:w-full transition-all duration-500 ease-out" />
                  </span>
                </Link>
              </div>
            ))}
          </nav>

          {/* Social Links */}
          <div
            className="flex flex-col items-center space-y-3 md:space-y-4"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0px)' : 'translateY(30px)',
              transition: isVisible
                ? 'opacity 0.5s ease 0.55s, transform 0.5s ease 0.55s'
                : 'opacity 0.2s ease 0s, transform 0.2s ease 0s',
            }}
          >
            <h3 className="label-text mb-2">FOLLOW US</h3>
            <div className="flex gap-4">
              <Link 
                href={contactInfo.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-4 border border-white/20 hover:border-white/40 hover:bg-white/5 hover:scale-110 transition-all duration-300"
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
                className="p-4 border border-white/20 hover:border-white/40 hover:bg-white/5 hover:scale-110 transition-all duration-300"
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
            <a 
              href={`mailto:${contactInfo.email}`}
              className="body-text hover:text-white/70 transition-colors duration-300 mt-4"
            >
              {contactInfo.email}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
