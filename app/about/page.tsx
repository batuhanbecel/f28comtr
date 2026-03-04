import Image from 'next/image';
import Link from 'next/link';
import { getPartnerLogos, getClientLogos } from '@/lib/utils';
import { contactInfo } from '@/lib/data';
import { Footer } from '@/components/Footer';

const SERVICES = ['Photography', 'Videography', 'CGI', 'Animation', 'Editing', 'Motion Graphics'];

export default function AboutPage() {
  const partnerLogos = getPartnerLogos();
  const clientLogos = getClientLogos();

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Hero — matches production / AI Based style */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 md:px-12 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <span className="section-label fade-in-up" style={{ animationDelay: '0.05s' }}>Istanbul — Since 2008</span>
          <h1 className="heading-hero gradient-text fade-in-up" style={{ animationDelay: '0.15s' }}>
            PRODUCTION<br />IS OUR LIFE
          </h1>
          <p className="body-text max-w-2xl mx-auto opacity-50 mt-8 fade-in-up" style={{ animationDelay: '0.25s' }}>
            Based in Istanbul, f/2.8 Production delivers high-quality photography
            and video services through an international portfolio. Working with
            leading brands worldwide — photography, video, CGI, animation,
            editing, and motion graphics.
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-10 fade-in-up" style={{ animationDelay: '0.35s' }}>
            {SERVICES.map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                <span className="text-white/20 font-mono text-[9px]">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-white/45 text-[10px] tracking-[0.35em] uppercase">{s}</span>
              </span>
            ))}
          </div>
        </div>
        {/* Scroll arrow */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-white/20 text-[9px] tracking-[0.45em] uppercase">Scroll</span>
            <svg className="w-4 h-4 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="square" d="M12 5v14M5 13l7 7 7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* Partner Agencies */}
      <section className="py-24 px-8 md:px-16 border-t border-white/[0.07]">
        <div className="mb-14">
          <span className="section-label">Collaborations</span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter mt-3">PARTNER AGENCIES</h2>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-px border border-white/[0.07]">
          {partnerLogos.map((logo) => {
            const name = logo.split('/').pop()?.replace(/\.(png|jpg|webp|svg)$/i, '') ?? '';
            return (
              <div key={logo} className="relative aspect-square flex items-center justify-center border-r border-b border-white/[0.05] group">
                <Image
                  src={logo} alt={name} fill
                  className="object-contain brightness-0 invert opacity-30 group-hover:opacity-65 transition-opacity duration-500 p-5"
                  sizes="12vw" loading="eager"
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* Clients */}
      <section className="py-24 px-8 md:px-16 border-t border-white/[0.07]">
        <div className="mb-14">
          <span className="section-label">Who We Work With</span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter mt-3">CLIENTS</h2>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-px border border-white/[0.07]">
          {clientLogos.map((logo) => {
            const name = logo.split('/').pop()?.replace(/\.(png|jpg|webp|svg)$/i, '') ?? '';
            return (
              <div key={logo} className="relative aspect-square flex items-center justify-center border-r border-b border-white/[0.05] group">
                <Image
                  src={logo} alt={name} fill
                  className="object-contain brightness-0 invert opacity-25 group-hover:opacity-60 transition-opacity duration-500 p-4"
                  sizes="10vw" loading="eager"
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact */}
      <section className="py-24 px-8 md:px-16 border-t border-white/[0.07]">
        <div className="mb-14">
          <span className="section-label">Contact</span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter mt-3">GET IN TOUCH</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-0 border-t border-white/[0.07]">
          {/* Address */}
          <div className="py-10 md:pr-12 md:border-r border-white/[0.07]">
            <p className="text-[9px] tracking-[0.55em] text-white/30 uppercase mb-4">Address</p>
            <p className="text-white/70 text-sm leading-relaxed">
              {contactInfo.address}<br />{contactInfo.city}
            </p>
          </div>

          {/* Email */}
          <div className="py-10 md:px-12 md:border-r border-white/[0.07] border-t md:border-t-0 border-white/[0.07]">
            <p className="text-[9px] tracking-[0.55em] text-white/30 uppercase mb-4">Email</p>
            <a
              href={`mailto:${contactInfo.email}`}
              className="text-white/70 text-sm hover:text-white transition-colors duration-300"
            >
              {contactInfo.email}
            </a>
          </div>

          {/* Social */}
          <div className="py-10 md:pl-12 border-t md:border-t-0 border-white/[0.07]">
            <p className="text-[9px] tracking-[0.55em] text-white/30 uppercase mb-6">Follow</p>
            <div className="flex items-center gap-6">
              <Link
                href={contactInfo.instagram}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors duration-300 group"
              >
                <Image src="/logos/social/instagram.svg" alt="Instagram" width={16} height={16}
                  className="w-4 h-4 brightness-0 invert opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="text-[10px] tracking-[0.4em] uppercase">Instagram</span>
              </Link>
              <Link
                href={contactInfo.linkedin}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors duration-300 group"
              >
                <Image src="/logos/social/linkedin.svg" alt="LinkedIn" width={16} height={16}
                  className="w-4 h-4 brightness-0 invert opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="text-[10px] tracking-[0.4em] uppercase">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
