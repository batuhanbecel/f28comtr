import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="fixed inset-0 flex flex-col md:flex-row">
      {/* Production Section */}
      <Link 
        href="/production"
        className="relative w-full md:w-1/2 h-1/2 md:h-full group overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/landing-1.webp"
            alt="Production"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500" />
        </div>
        
        <div className="relative h-full flex items-center justify-center px-6">
          <div className="text-center transform transition-all duration-500 group-hover:scale-110">
            <h1 className="heading-hero gradient-text mb-4 md:mb-6">
              PRODUCTION
            </h1>
            <p className="body-text opacity-60 group-hover:opacity-100 transition-opacity">
              Photography & Retouching
            </p>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute right-0 md:right-0 bottom-0 md:bottom-auto top-auto md:top-0 left-0 md:left-auto w-full md:w-1 h-px md:h-full bg-gradient-to-r md:bg-gradient-to-b from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* AI Based Section */}
      <Link 
        href="/ai-based"
        className="relative w-full md:w-1/2 h-1/2 md:h-full group overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/landing-2.jpg"
            alt="AI Based"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500" />
        </div>
        
        <div className="relative h-full flex items-center justify-center px-6">
          <div className="text-center transform transition-all duration-500 group-hover:scale-110">
            <h1 className="heading-hero gradient-text mb-4 md:mb-6">
              AI BASED
            </h1>
            <p className="body-text opacity-60 group-hover:opacity-100 transition-opacity">
              Artificial Intelligence & Creativity
            </p>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute left-0 md:left-0 top-0 md:top-0 right-0 md:right-auto bottom-auto md:bottom-0 w-full md:w-1 h-px md:h-full bg-gradient-to-r md:bg-gradient-to-b from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Center Divider */}
      <div className="absolute left-0 md:left-1/2 top-1/2 md:top-0 right-0 md:right-auto bottom-auto md:bottom-0 w-full md:w-px h-px md:h-full bg-gradient-to-r md:bg-gradient-to-b from-transparent via-white/10 to-transparent transform -translate-y-1/2 md:translate-y-0 md:-translate-x-1/2" />
    </main>
  );
}
