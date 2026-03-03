import { getPhotographers } from '@/lib/db';
import { ParallaxSection } from '@/components/ParallaxSection';

export const revalidate = 60;

export default async function ProductionPage() {
  const photographers = await getPhotographers();

  return (
    <main className="min-h-screen">
      {photographers.map((photographer, index) => (
        <ParallaxSection
          key={photographer.id}
          photographer={photographer}
          index={index}
        />
      ))}
    </main>
  );
}
