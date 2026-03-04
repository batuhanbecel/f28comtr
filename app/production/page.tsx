import { getPhotographers } from '@/lib/db';
import { ParallaxSection } from '@/components/ParallaxSection';
import { Footer } from '@/components/Footer';

export const revalidate = 60;

export default async function ProductionPage() {
  const photographers = await getPhotographers();

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="pt-48 pb-28 px-6 md:px-12 relative overflow-hidden">
        <div className="text-center max-w-5xl mx-auto">
          <span className="section-label fade-in-up" style={{animationDelay: '0.05s'}}>Istanbul — Since 2008</span>
          <h1 className="heading-hero gradient-text fade-in-up" style={{animationDelay: '0.15s'}}>
            PRODUCTION
          </h1>
          <p className="body-text max-w-3xl mx-auto opacity-50 mt-8 fade-in-up" style={{animationDelay: '0.25s'}}>
            Based in Istanbul since 2008, f/2.8 Production delivers high-quality photography and video services through an international portfolio. Working with many leading brands from around the world, the team provides efficient solutions for photography, video, CGI, animation, editing, and motion graphics.
          </p>
        </div>
      </section>

      {photographers.map((photographer, index) => (
        <ParallaxSection
          key={photographer.id}
          photographer={photographer}
          index={index}
          total={photographers.length}
        />
      ))}
      <Footer />
    </main>
  );
}
