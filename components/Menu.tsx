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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
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
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6 md:p-8 transition-all duration-500 ${
        isScrolled ? 'backdrop-blur-xl bg-black/40 shadow-lg' : ''
      }`}>
        <Link href="/" className="z-50 transform transition-transform duration-300 hover:scale-105">
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
          className="z-50 relative w-12 h-12 flex items-center justify-center group"
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
      </nav>

      {/* Menu Overlay - Slide from right */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full md:w-2/3 lg:w-1/2 z-40 transition-all duration-700 ease-out ${
          isOpen ? 'translate-x-0 pointer-events-auto opacity-100' : 'translate-x-full pointer-events-none opacity-0'
        }`}
      >
        {/* Background with parallax effect */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/menubg.webp"
            alt="Menu background"
            fill
            className="object-cover"
            priority
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/85 to-black/90 backdrop-blur-sm" />
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-white/20 via-white/5 to-white/20" />
        </div>

        {/* Menu Content */}
        <div className="relative h-full flex flex-col justify-between text-white p-8 md:p-12 lg:p-16">
          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col justify-center space-y-6 md:space-y-8">
            {menuItems.map((item, index) => (
              <div
                key={item.href}
                className={`transform transition-all duration-700 ${
                  isOpen 
                    ? 'translate-x-0 opacity-100' 
                    : 'translate-x-20 opacity-0'
                }`}
                style={{ transitionDelay: isOpen ? `${(index + 1) * 100}ms` : '0ms' }}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="group relative inline-block heading-hero text-white hover:text-white/70 transition-all duration-500 hover:translate-x-2"
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </nav>

          {/* Contact Section */}
          <div 
            className={`border-t border-white/10 pt-8 transform transition-all duration-700 delay-500 ${
              isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="space-y-6">
              <div>
                <h3 className="label-text mb-3">Contact</h3>
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="block body-text hover:text-white/70 transition-colors duration-300"
                >
                  {contactInfo.email}
                </a>
              </div>
              
              <div>
                <h3 className="label-text mb-3">Location</h3>
                <p className="body-text opacity-80 text-sm">
                  {contactInfo.address}<br/>
                  {contactInfo.city}
                </p>
              </div>

              <div>
                <h3 className="label-text mb-3">Follow Us</h3>
                <div className="flex gap-3">
                  <Link 
                    href={contactInfo.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 border border-white/20 rounded-lg hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                  >
                    <Image
                      src="/logos/social/instagram.svg"
                      alt="Instagram"
                      width={20}
                      height={20}
                      className="w-5 h-5 filter brightness-0 invert"
                    />
                  </Link>
                  <Link 
                    href={contactInfo.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 border border-white/20 rounded-lg hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                  >
                    <Image
                      src="/logos/social/linkedin.svg"
                      alt="LinkedIn"
                      width={20}
                      height={20}
                      className="w-5 h-5 filter brightness-0 invert"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />
    </>
  );
}
