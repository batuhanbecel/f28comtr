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
      <section className="min-h-screen flex items-center justify-center px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <h1 className="heading-hero gradient-text mb-12 fade-in-up" style={{animationDelay: '0.1s'}}>
            PRODUCTION<br/>IS OUR LIFE
          </h1>
          <p className="body-text max-w-3xl mx-auto opacity-80 fade-in-up" style={{animationDelay: '0.2s'}}>
            Based in Istanbul since 2008, f/2.8 Production delivers high-quality photography and video services through an international portfolio. Working with many leading brands from around the world, the team provides efficient solutions for photography, video, CGI, animation, editing, and motion graphics.
          </p>
        </div>
      </section>

      {/* Partner Agencies */}
      <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-white/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 className="heading-lg text-center mb-16">
            Partner Agencies
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 items-center">
            {partnerLogos.map((logo) => {
              const brandName = logo.split('/').pop()?.replace(/\.(png|jpg|webp|svg)$/i, '') || '';
              return (
                <div
                  key={logo}
                  className="relative aspect-square flex items-center justify-center p-6 rounded-lg glass-effect hover-lift"
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
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="heading-lg text-center mb-16">
            Clients
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
            {clientLogos.map((logo) => {
              const brandName = logo.split('/').pop()?.replace(/\.(png|jpg|webp|svg)$/i, '') || '';
              return (
                <div
                  key={logo}
                  className="relative aspect-square flex items-center justify-center p-4 rounded-lg glass-effect hover-lift"
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
          <h2 className="heading-lg text-center mb-16">
            Services
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {services.map((service, index) => (
              <div
                key={service}
                className="text-center p-5 glass-effect rounded-lg hover-lift fade-in-up"
                style={{animationDelay: `${index * 0.05}s`}}
              >
                <p className="body-text">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-transparent to-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="heading-lg text-center mb-16">
            Get in Touch
          </h2>
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <div className="space-y-8">
              <div className="glass-effect p-6 rounded-lg">
                <h3 className="label-text mb-3">Address</h3>
                <p className="body-text opacity-90">
                  {contactInfo.address}<br/>
                  {contactInfo.city}
                </p>
              </div>
              <div className="glass-effect p-6 rounded-lg">
                <h3 className="label-text mb-3">Email</h3>
                <a href={`mailto:${contactInfo.email}`} className="body-text hover:opacity-70 transition-opacity">
                  {contactInfo.email}
                </a>
              </div>
            </div>
            <div className="glass-effect p-6 rounded-lg">
              <h3 className="label-text mb-6">Follow Us</h3>
              <div className="flex gap-4">
                <Link href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="p-4 glass-effect rounded-lg hover-lift">
                  <Image
                    src="/logos/social/instagram.svg"
                    alt="Instagram"
                    width={28}
                    height={28}
                    className="w-7 h-7 filter brightness-0 invert"
                  />
                </Link>
                <Link href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="p-4 glass-effect rounded-lg hover-lift">
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
    </main>
  );
}
