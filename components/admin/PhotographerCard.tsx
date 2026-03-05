'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Photographer } from '@/lib/data';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface PhotographerCardProps {
  photographer: Photographer;
  index: number;
  total: number;
  deleteAction: (formData: FormData) => Promise<void>;
}

export function PhotographerCard({ photographer, index, total, deleteAction }: PhotographerCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete ${photographer.fullName}? This cannot be undone.`)) return;
    
    setIsDeleting(true);
    const formData = new FormData();
    formData.append('id', photographer.id);
    
    try {
      await deleteAction(formData);
      toast.success(`${photographer.fullName} deleted`);
    } catch (error) {
      toast.error('Failed to delete photographer');
      setIsDeleting(false);
    }
  };

  return (
    <div className="group relative aspect-[3/4] overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 rounded-lg transition-all">
      <Image
        src={photographer.preview}
        alt={photographer.fullName}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">{photographer.title}</p>
        <p className="text-white font-bold">{photographer.fullName}</p>
      </div>

      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded">
        <span className="text-white/50 text-xs font-mono">#{index + 1}</span>
      </div>

      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
        <div className="flex justify-between items-start">
          <span className="text-white/50 text-xs">#{index + 1}</span>
        </div>

        <div className="text-center">
          <p className="text-white font-bold mb-1">{photographer.fullName}</p>
          <p className="text-white/50 text-xs uppercase tracking-wider">{photographer.title}</p>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/admin/photographers/${photographer.id}`}
            className="flex-1 py-2 text-center text-xs font-semibold uppercase bg-white text-black hover:bg-white/90 transition-colors rounded"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-2 text-xs uppercase text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors border border-red-400/20 rounded disabled:opacity-50"
          >
            {isDeleting ? '...' : '✕'}
          </button>
        </div>
      </div>
    </div>
  );
}
