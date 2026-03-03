import Image from 'next/image';
import Link from 'next/link';
import { getPartnerLogos, getClientLogos } from '@/lib/utils';
import { contactInfo } from '@/lib/data';

export default function AboutPage() {
  const partnerLogos = getPartnerLogos();
  const clientLogos = getClientLogos();

  const services = [
    'Photography',
    'Videography',
    'CGI',
    'Animation',
    'Editing',
    'Motion Graphics'
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 md:px-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black/90" />
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <Image
            src="/logos/f28/f28_white.png"
            alt="f/28"
            width={250}
            height={125}
            className="mx-auto mb-16 h-24 w-auto"
          />
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight mb-8 leading-none">
            PRODUCTION<br/>IS OUR LIFE
          </h1>
          <p className="text-xl md:text-2xl font-light max-w-4xl mx-auto leading-relaxed opacity-90">
            Based in Istanbul since 2008, f/2.8 Production delivers high-quality photography and video services through an international portfolio. Working with many leading brands from around the world, the team provides efficient solutions for photography, video, CGI, animation, editing, and motion graphics.
          </p>
        </div>
      </section>

      {/* Partner Agencies */}
      <section className="py-20 px-6 md:px-12 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light tracking-wider text-center mb-16">
            PARTNER AGENCIES
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center">
            {partnerLogos.map((logo) => {
              const brandName = logo.split('/').pop()?.replace(/\.(png|jpg|webp|svg)$/i, '') || '';
              return (
                <div
                  key={logo}
                  className="relative aspect-square flex items-center justify-center p-6 hover:scale-110 transition-transform duration-300"
                >
                  <Image
                    src={logo}
                    alt={brandName}
                    fill
                    className="object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
                    sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
                    loading="eager"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light tracking-wider text-center mb-16">
            CLIENTS
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {clientLogos.map((logo) => {
              const brandName = logo.split('/').pop()?.replace(/\.(png|jpg|webp|svg)$/i, '') || '';
              return (
                <div
                  key={logo}
                  className="relative aspect-square flex items-center justify-center p-4 hover:scale-110 transition-transform duration-300"
                >
                  <Image
                    src={logo}
                    alt={brandName}
                    fill
                    className="object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
                    sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 16vw"
                    loading="eager"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 md:px-12 bg-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light tracking-wider text-center mb-16">
            GET IN TOUCH
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm tracking-[0.3em] mb-2 opacity-60">ADDRESS</h3>
                <p className="text-lg md:text-xl leading-relaxed">
                  {contactInfo.address}<br/>
                  {contactInfo.city}
                </p>
              </div>
              <div>
                <h3 className="text-sm tracking-[0.3em] mb-2 opacity-60">EMAIL</h3>
                <a href={`mailto:${contactInfo.email}`} className="text-lg md:text-xl hover:opacity-70 transition-opacity">
                  {contactInfo.email}
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm tracking-[0.3em] mb-4 opacity-60">FOLLOW US</h3>
              <div className="flex gap-6">
                <Link href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                  <Image
                    src="/logos/social/instagram.svg"
                    alt="Instagram"
                    width={32}
                    height={32}
                    className="w-8 h-8 filter brightness-0 invert"
                  />
                </Link>
                <Link href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                  <Image
                    src="/logos/social/linkedin.svg"
                    alt="LinkedIn"
                    width={32}
                    height={32}
                    className="w-8 h-8 filter brightness-0 invert"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Bottom */}
      <section className="py-20 px-6 md:px-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light tracking-wider text-center mb-16">
            SERVICES
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {services.map((service) => (
              <div
                key={service}
                className="text-center p-6 border border-white/10 hover:border-white/40 hover:bg-white/5 transition-all duration-300"
              >
                <p className="text-base md:text-lg font-light tracking-wide">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
