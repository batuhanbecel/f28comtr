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
    const fetchPreviews = async () => {
      try {
        const res = await fetch('/api/admin/preview-images');
        if (res.ok) {
          const data = await res.json();
          setPreviewImages(data.images || []);
        }
      } catch {
        console.error('Failed to fetch preview images');
      }
    };
    fetchPreviews();
  }, []);

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
              <option value="">Select a preview image</option>
              {previewImages.map((img, index) => (
                <option key={img} value={img}>
                  Preview {index + 1}
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
