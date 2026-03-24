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
        
        if (!photographersRes.ok || !imagesRes.ok) {
          throw new Error('Failed to fetch data');
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
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [photographerId, router]);

  const handlePreviewSelect = async (imageUrl: string) => {
    if (!photographer) return;
    
    console.log('Setting preview to:', imageUrl);
    
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
      
      console.log('API response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('API response:', data);
        
        setPhotographer(prev => prev ? { ...prev, preview: imageUrl } : null);
        // Preview image form'u da güncelle
        const event = new CustomEvent('preview-updated', { detail: imageUrl });
        window.dispatchEvent(event);
        
        console.log('Preview updated successfully to:', imageUrl);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('API error:', errorData);
      }
    } catch (error) {
      console.error('Failed to update preview:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-white/50">Loading...</div>
      </div>
    );
  }

  if (!photographer) {
    return null;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/photographers" className="text-white/50 text-sm mb-2 inline-block hover:text-white">
            ← Back to Photographers
          </Link>
          <h1 className="text-4xl font-bold mb-2">{photographer.fullName}</h1>
          <p className="text-white/50">Edit photographer information and manage portfolio images</p>
        </div>

        {/* Photographer Info */}
        <PhotographerInfoForm photographer={photographer} />

        {/* Image Gallery */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Portfolio Images</h2>
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
