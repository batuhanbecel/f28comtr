'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import type { Photographer } from '@/lib/data';
import Image from 'next/image';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { AdminFormField, AdminInput } from '@/components/admin/AdminFormField';
import { AdminButton } from '@/components/admin/AdminButton';
import { useAdminT } from '@/hooks/useAdminT';

interface PhotographerInfoFormProps {
  photographer: Photographer;
}

export function PhotographerInfoForm({ photographer }: PhotographerInfoFormProps) {
  const router = useRouter();
  const a = useAdminT();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: photographer.fullName,
    title: photographer.title,
    preview: photographer.preview,
  });

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
        toast.success(a.photographerEdit.updated);
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || a.toast.updateFailed);
      }
    } catch {
      toast.error(a.toast.updatePhotographerFailed);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminPanel label={a.photographerEdit.information} title={a.photographerEdit.details}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AdminFormField label={a.photographers.fullName}>
            <AdminInput
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value.toUpperCase() })}
              required
            />
          </AdminFormField>
          <AdminFormField label={a.photographers.titleField}>
            <AdminInput
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value.toUpperCase() })}
              required
            />
          </AdminFormField>
          <AdminFormField label={a.photographerEdit.previewImage}>
            {formData.preview ? (
              <div className="flex items-center gap-3 mt-1">
                <div className="relative h-14 w-14 border border-th-fg/[0.08] overflow-hidden flex-shrink-0">
                  <Image
                    src={formData.preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <p className="text-[10px] text-th-fg/30 tracking-wide">{a.photographerEdit.previewChange}</p>
              </div>
            ) : (
              <p className="text-xs admin-muted py-2">{a.photographerEdit.previewHint}</p>
            )}
          </AdminFormField>
        </div>
        <AdminButton type="submit" variant="primary" disabled={isSaving} className="disabled:opacity-50">
          {isSaving ? a.actions.savingInfo : a.actions.saveInfo}
        </AdminButton>
      </form>
    </AdminPanel>
  );
}
