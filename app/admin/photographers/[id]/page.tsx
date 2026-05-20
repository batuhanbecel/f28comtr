'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PhotographerImageGallery } from '@/components/admin/PhotographerImageGallery';
import { PhotographerInfoForm } from '@/components/admin/PhotographerInfoForm';
import type { Photographer } from '@/lib/data';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditPhotographerPage({ params }: PageProps) {
  const router = useRouter();
  const [photographer, setPhotographer] = useState<Photographer | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [photographerId, setPhotographerId] = useState<string>('');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setPhotographerId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!photographerId) return;

    const loadData = async () => {
      try {
        const [photographersRes, imagesRes] = await Promise.all([
          fetch('/api/admin/photographers'),
          fetch(`/api/admin/photographers/${photographerId}/images`)
        ]);

        if (imagesRes.status === 401 || photographersRes.status === 401) {
          router.push('/admin/login');
          return;
        }

        if (!photographersRes.ok || !imagesRes.ok) {
          router.push('/admin/photographers');
          return;
        }

        const photographersData = await photographersRes.json();
        const imagesData = await imagesRes.json();

        const foundPhotographer = photographersData.find((p: Photographer) => p.id === photographerId);
        if (!foundPhotographer) {
          router.push('/admin/photographers');
          return;
        }

        setPhotographer(foundPhotographer);
        setImages(imagesData.images || []);
      } catch {
        router.push('/admin/photographers');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [photographerId, router]);

  const handlePreviewSelect = async (imageUrl: string) => {
    if (!photographer) return;
    
    try {
      const res = await fetch(`/api/admin/photographers/${photographer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fullName: photographer.fullName,
          title: photographer.title,
          preview: imageUrl 
        }),
      });
      
      if (res.ok) {
        setPhotographer(prev => prev ? { ...prev, preview: imageUrl } : null);
        const event = new CustomEvent('preview-updated', { detail: imageUrl });
        window.dispatchEvent(event);
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <header className="border-b border-th-fg/[0.06] px-8 py-5 sticky top-0 bg-th-surface/95 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <span className="text-th-fg/25 text-[10px] tracking-[0.3em] uppercase">← Photographers</span>
            <div className="w-px h-3 bg-th-fg/10" />
            <span className="text-th-fg/25 text-[10px] tracking-[0.3em] uppercase">Loading...</span>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-8 py-10">
          <div className="space-y-3">
            <div className="h-4 bg-th-fg/[0.03] animate-pulse w-32" />
            <div className="h-8 bg-th-fg/[0.03] animate-pulse w-64" />
            <div className="h-4 bg-th-fg/[0.03] animate-pulse w-48 mb-8" />
            <div className="h-32 bg-th-fg/[0.03] animate-pulse" />
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1.5 mt-8">
              {[...Array(12)].map((_, i) => <div key={i} className="aspect-square bg-th-fg/[0.03] animate-pulse" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!photographer) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-th-fg/[0.06] px-8 py-5 flex items-center justify-between sticky top-0 bg-th-surface/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <Link href="/admin/photographers" className="text-th-fg/25 text-[10px] tracking-[0.3em] uppercase hover:text-th-fg/60 transition-colors">
            ← Photographers
          </Link>
          <div className="w-px h-3 bg-th-fg/10" />
          <span className="text-th-fg/25 text-[10px] tracking-[0.3em] uppercase">{photographer.fullName}</span>
        </div>
        <Link
          href={`/${photographer.id}`}
          target="_blank"
          className="text-th-fg/30 text-[10px] tracking-[0.25em] uppercase hover:text-th-fg/60 transition-colors px-3 py-2 hover:bg-th-fg/5"
        >
          View Portfolio ↗
        </Link>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="mb-8">
          <p className="text-th-fg/20 text-[10px] tracking-[0.5em] uppercase mb-2">Edit Photographer</p>
          <h1 className="text-3xl font-black tracking-tighter">{photographer.fullName}</h1>
          <p className="text-th-fg/25 text-xs mt-1">
            {images.length} portfolio images — use ⭐ to set preview
          </p>
        </div>

        <PhotographerInfoForm photographer={photographer} />

        <div className="mt-10">
          <p className="text-th-fg/20 text-[10px] tracking-[0.5em] uppercase mb-4">Portfolio Images</p>
          <PhotographerImageGallery 
            images={images} 
            photographerId={photographer.id}
            photographerName={photographer.fullName}
            currentPreview={photographer.preview}
            onPreviewSelect={handlePreviewSelect}
          />
        </div>
      </div>
    </div>
  );
}
