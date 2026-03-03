import { photographers } from '@/lib/data';
import { ParallaxSection } from '@/components/ParallaxSection';

export default function Home() {
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
