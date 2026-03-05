'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export function AddPhotographerForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      id: formData.get('id') as string,
      fullName: formData.get('fullName') as string,
      title: formData.get('title') as string,
      preview: formData.get('preview') as string || `/portfolios/previews/${formData.get('id')}.webp`,
      name: (formData.get('fullName') as string).split(' ')[0],
      folder: formData.get('id') as string,
    };

    try {
      const res = await fetch('/api/admin/photographers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success(`${data.fullName} added successfully`);
        setIsOpen(false);
        router.refresh();
        (e.target as HTMLFormElement).reset();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to add photographer');
      }
    } catch (error) {
      toast.error('Failed to add photographer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Add New Photographer</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-white text-black font-semibold rounded hover:bg-white/90 transition-colors"
        >
          {isOpen ? 'Cancel' : '+ Add New'}
        </button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">ID / Folder Name</label>
              <input
                type="text"
                name="id"
                required
                placeholder="e.g. john-doe"
                className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-white/40"
                onChange={(e) => {
                  e.target.value = e.target.value.toLowerCase().replace(/\s+/g, '-');
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                required
                placeholder="e.g. JOHN DOE"
                className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-white/40"
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                name="title"
                required
                defaultValue="PHOTOGRAPHER"
                placeholder="PHOTOGRAPHER"
                className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-white/40"
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Preview Image Path (optional)</label>
              <input
                type="text"
                name="preview"
                placeholder="/portfolios/previews/name.webp"
                className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-white/40"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-white text-black font-semibold rounded hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Photographer'}
          </button>
        </form>
      )}
    </div>
  );
}
