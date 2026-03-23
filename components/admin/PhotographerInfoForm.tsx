'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import type { Photographer } from '@/lib/data';
import Image from 'next/image';

interface PhotographerInfoFormProps {
  photographer: Photographer;
}

export function PhotographerInfoForm({ photographer }: PhotographerInfoFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    fullName: photographer.fullName,
    title: photographer.title,
    preview: photographer.preview,
  });

  useEffect(() => {
    const fetchImages = async () => {
      console.log('Fetching images for photographer:', photographer.id);
      
      try {
        // Fetch both dedicated preview images and portfolio images
        const [previewRes, portfolioRes] = await Promise.all([
          fetch('/api/admin/preview-images'),
          fetch(`/api/admin/photographers/${photographer.id}/images`)
        ]);
        
        console.log('Preview API response:', previewRes.status);
        console.log('Portfolio API response:', portfolioRes.status);
        
        let allImages: string[] = [];
        
        // Add portfolio images first
        if (portfolioRes.ok) {
          const portfolioData = await portfolioRes.json();
          console.log('Portfolio data:', portfolioData);
          allImages = [...allImages, ...(portfolioData.images || [])];
        } else {
          console.error('Portfolio API failed:', portfolioRes.status);
          const errorData = await portfolioRes.json().catch(() => ({}));
          console.error('Portfolio error:', errorData);
        }
        
        // Add dedicated preview images
        if (previewRes.ok) {
          const previewData = await previewRes.json();
          console.log('Preview data:', previewData);
          allImages = [...allImages, ...(previewData.images || [])];
        } else {
          console.error('Preview API failed:', previewRes.status);
          const errorData = await previewRes.json().catch(() => ({}));
          console.error('Preview error:', errorData);
        }
        
        // Remove duplicates
        const uniqueImages = Array.from(new Set(allImages));
        console.log('Total unique images:', uniqueImages.length);
        setPreviewImages(uniqueImages);
      } catch (error) {
        console.error('Failed to fetch images:', error);
      }
    };
    fetchImages();
  }, [photographer.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch(`/api/admin/photographers/${photographer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Photographer info updated');
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update');
      }
    } catch (error) {
      toast.error('Failed to update photographer');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Photographer Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value.toUpperCase() })}
              className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-white/40"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value.toUpperCase() })}
              className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-white/40"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Preview Image</label>
            <select
              value={formData.preview}
              onChange={(e) => setFormData({ ...formData, preview: e.target.value })}
              className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-white/40 text-white"
            >
              <option value="">Select an image</option>
              {previewImages.map((img, index) => (
                <option key={img} value={img}>
                  Image {index + 1}
                </option>
              ))}
            </select>
            {formData.preview && (
              <div className="mt-2 relative h-20 w-20 border border-white/10 rounded overflow-hidden">
                <Image
                  src={formData.preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            )}
            {previewImages.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-white/40 mb-2">Available images (portfolio + previews):</p>
                <div className="grid grid-cols-6 gap-1">
                  {previewImages.map((img, index) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setFormData({ ...formData, preview: img })}
                      className={`relative aspect-square border rounded overflow-hidden transition-all ${
                        formData.preview === img 
                          ? 'border-white/40 ring-1 ring-white/20' 
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-white text-black font-semibold rounded hover:bg-white/90 transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
