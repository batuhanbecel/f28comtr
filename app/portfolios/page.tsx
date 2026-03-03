import Image from 'next/image';
import Link from 'next/link';
import { photographers } from '@/lib/data';

export default function PortfoliosPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-6 md:px-12">
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-wider text-center mb-16">
        PORTFOLIOS
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {photographers.map((photographer, index) => (
          <Link
            key={photographer.id}
            href={`/portfolio/${photographer.id}`}
            className="group relative aspect-[4/5] overflow-hidden bg-gray-900"
          >
            <Image
              src={photographer.preview}
              alt={photographer.fullName}
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="eager"
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <p className="text-xs md:text-sm tracking-[0.3em] mb-2 font-light opacity-80">
                  {photographer.title}
                </p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-wide">
                  {photographer.fullName}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
