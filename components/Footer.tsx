import Link from 'next/link';
import Image from 'next/image';
import { contactInfo } from '@/lib/data';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/" className="opacity-60 hover:opacity-100 transition-opacity duration-300">
          <Image
            src="/logos/f28/f28_white.png"
            alt="f/2.8"
            width={80}
            height={40}
            className="h-7 w-auto"
          />
        </Link>

        <p className="text-white/20 text-[10px] tracking-[0.3em] uppercase">
          &copy; {new Date().getFullYear()} f/2.8 Production — Istanbul
        </p>

        <a
          href={`mailto:${contactInfo.email}`}
          className="text-white/30 text-[11px] tracking-widest hover:text-white/70 transition-colors duration-300"
        >
          {contactInfo.email}
        </a>
      </div>
    </footer>
  );
}
