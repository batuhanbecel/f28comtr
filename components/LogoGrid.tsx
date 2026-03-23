'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { shouldSkipOptimization } from '@/lib/blob';

interface LogoCategory {
  key: string;
  name: string;
  images: string[];
}

export function LogoGrid() {
  const [categories, setCategories] = useState<LogoCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const res = await fetch('/api/admin/logos');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch {
        console.error('Failed to fetch logos');
      } finally {
        setLoading(false);
      }
    };
    fetchLogos();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="aspect-square bg-white/[0.03] animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {categories.map((category) => (
        <div key={category.key}>
          <h3 className="text-white/40 text-sm font-medium mb-4 tracking-wider uppercase">
            {category.name}
          </h3>
          {category.images.length === 0 ? (
            <p className="text-white/10 text-sm">No {category.name.toLowerCase()} available</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {category.images.map((logo, index) => (
                <div
                  key={logo}
                  className="relative aspect-square bg-white/[0.03] border border-white/[0.06] rounded-lg overflow-hidden hover:border-white/20 transition-colors"
                >
                  <Image
                    src={logo}
                    alt={`${category.name} ${index + 1}`}
                    fill
                    className="object-contain p-3"
                    sizes="(max-width: 768px) 33vw, (max-width: 1024px) 20vw, 15vw"
                    unoptimized={shouldSkipOptimization(logo)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
