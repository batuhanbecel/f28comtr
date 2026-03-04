import Image from 'next/image';
import Link from 'next/link';
import { getPartnerLogos, getClientLogos } from '@/lib/utils';
import { contactInfo } from '@/lib/data';
import { Footer } from '@/components/Footer';

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
      <section className="min-h-screen flex items-center justify-center px-6 md:px-12 relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-black" />
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <span className="section-label fade-in-up" style={{animationDelay: '0.05s'}}>Istanbul — Since 2008</span>
          <h1 className="heading-hero gradient-text mb-12 fade-in-up" style={{animationDelay: '0.15s'}}>
            PRODUCTION<br/>IS OUR LIFE
          </h1>
          <p className="body-text max-w-3xl mx-auto opacity-60 fade-in-up" style={{animationDelay: '0.25s'}}>
            Based in Istanbul since 2008, f/2.8 Production delivers high-quality photography and video services through an international portfolio. Working with many leading brands from around the world, the team provides efficient solutions for photography, video, CGI, animation, editing, and motion graphics.
          </p>
        </div>
      </section>

      {/* Partner Agencies */}
      <section className="py-24 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <span className="section-label text-center block">Collaborations</span>
          <h2 className="heading-lg text-center mb-16">
            Partner Agencies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 items-center">
            {partnerLogos.map((logo) => {
              const brandName = logo.split('/').pop()?.replace(/\.(png|jpg|webp|svg)$/i, '') || '';
              return (
                <div
                  key={logo}
                  className="relative aspect-square flex items-center justify-center p-6 glass-effect hover-lift"
                >
                  <Image
                    src={logo}
                    alt={brandName}
                    fill
                    className="object-contain filter brightness-0 invert opacity-60 group-hover:opacity-100 transition-opacity p-4"
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
      <section className="py-24 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <span className="section-label text-center block">Who We Work With</span>
          <h2 className="heading-lg text-center mb-16">
            Clients
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 items-center">
            {clientLogos.map((logo) => {
              const brandName = logo.split('/').pop()?.replace(/\.(png|jpg|webp|svg)$/i, '') || '';
              return (
                <div
                  key={logo}
                  className="relative aspect-square flex items-center justify-center p-4 glass-effect hover-lift"
                >
                  <Image
                    src={logo}
                    alt={brandName}
                    fill
                    className="object-contain filter brightness-0 invert opacity-60 group-hover:opacity-100 transition-opacity p-3"
                    sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 16vw"
                    loading="eager"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section - Bottom */}
      <section className="py-24 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <span className="section-label text-center block">What We Do</span>
          <h2 className="heading-lg text-center mb-16">
            Services
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {services.map((service) => (
              <div
                key={service}
                className="text-center p-4 md:p-5 glass-effect hover-lift"
              >
                <p className="label-text opacity-100 normal-case tracking-widest text-xs md:text-sm">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <span className="section-label text-center block">Contact</span>
          <h2 className="heading-lg text-center mb-16">
            Get in Touch
          </h2>
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <div className="space-y-8">
              <div className="glass-effect p-6">
                <h3 className="label-text mb-3">Address</h3>
                <p className="body-text opacity-90">
                  {contactInfo.address}<br/>
                  {contactInfo.city}
                </p>
              </div>
              <div className="glass-effect p-6">
                <h3 className="label-text mb-3">Email</h3>
                <a href={`mailto:${contactInfo.email}`} className="body-text hover:opacity-70 transition-all duration-500">
                  {contactInfo.email}
                </a>
              </div>
            </div>
            <div className="glass-effect p-6">
              <h3 className="label-text mb-6">Follow Us</h3>
              <div className="flex gap-4">
                <Link href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="p-4 glass-effect hover-lift">
                  <Image
                    src="/logos/social/instagram.svg"
                    alt="Instagram"
                    width={28}
                    height={28}
                    className="w-7 h-7 filter brightness-0 invert"
                  />
                </Link>
                <Link href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="p-4 glass-effect hover-lift">
                  <Image
                    src="/logos/social/linkedin.svg"
                    alt="LinkedIn"
                    width={28}
                    height={28}
                    className="w-7 h-7 filter brightness-0 invert"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
