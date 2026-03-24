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
  const [formData, setFormData] = useState({
    fullName: photographer.fullName,
    title: photographer.title,
    preview: photographer.preview,
  });

  // Listen for preview updates from the star button in gallery
  useEffect(() => {
    const handlePreviewUpdate = (event: CustomEvent) => {
      setFormData(prev => ({ ...prev, preview: event.detail }));
    };

    window.addEventListener('preview-updated', handlePreviewUpdate as EventListener);
    return () => {
      window.removeEventListener('preview-updated', handlePreviewUpdate as EventListener);
    };
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
    } catch {
      toast.error('Failed to update photographer');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="border border-white/[0.07] bg-white/[0.02] rounded-lg p-6">
      <p className="text-[10px] tracking-[0.4em] uppercase text-white/20 mb-4">Information</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] tracking-widest uppercase text-white/25 block mb-1.5">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value.toUpperCase() })}
              className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/15 px-3 py-2.5 text-sm focus:outline-none focus:border-white/25 transition-colors rounded"
              required
            />
          </div>
          <div>
            <label className="text-[10px] tracking-widest uppercase text-white/25 block mb-1.5">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value.toUpperCase() })}
              className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/15 px-3 py-2.5 text-sm focus:outline-none focus:border-white/25 transition-colors rounded"
              required
            />
          </div>
          <div>
            <label className="text-[10px] tracking-widest uppercase text-white/25 block mb-1.5">Preview Image</label>
            {formData.preview ? (
              <div className="flex items-center gap-3 mt-1">
                <div className="relative h-14 w-14 border border-white/[0.08] rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={formData.preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <p className="text-[10px] text-white/30 tracking-wide">Use ⭐ on images below to change</p>
              </div>
            ) : (
              <p className="text-xs text-white/20 py-2">Use ⭐ on images below to set preview</p>
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="bg-white text-black text-[10px] font-bold tracking-[0.3em] uppercase px-5 py-2.5 hover:bg-white/90 transition-colors disabled:opacity-50 rounded"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
