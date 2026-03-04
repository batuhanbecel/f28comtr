import Image from 'next/image';
import Link from 'next/link';
import { photographers } from '@/lib/data';
import { Footer } from '@/components/Footer';

export default function PortfoliosPage() {
  return (
    <main className="min-h-screen pt-36 pb-20 px-6 md:px-12">
      <div className="text-center mb-16">
        <span className="section-label">Our Work</span>
        <h1 className="heading-hero gradient-text">
          PORTFOLIOS
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {photographers.map((photographer, index) => (
          <Link
            key={photographer.id}
            href={`/portfolio/${photographer.id}`}
            className="group relative aspect-[4/5] overflow-hidden bg-black hover-lift"
          >
            <Image
              src={photographer.preview}
              alt={photographer.fullName}
              fill
              className="object-cover object-center transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="eager"
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-90 transition-all duration-300" />
            <div className="absolute inset-0 flex items-end p-6 md:p-8">
              <div className="text-left text-white transform transition-transform duration-300 group-hover:translate-y-[-4px]">
                <p className="text-xs tracking-[0.4em] mb-2 font-light opacity-80 uppercase">
                  {photographer.title}
                </p>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {photographer.fullName}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Footer />
    </main>
  );
}
