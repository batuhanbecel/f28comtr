'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { shouldSkipOptimization } from '@/lib/blob';

function SortableItem({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className="relative aspect-square overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-white/15 rounded cursor-grab active:cursor-grabbing group">
      <Image src={id} alt="AI" fill className="object-cover" sizes="20vw" unoptimized={shouldSkipOptimization(id)} />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
        <span className="opacity-0 group-hover:opacity-100 text-white/60 text-[9px] tracking-[0.3em] uppercase select-none">drag</span>
      </div>
    </div>
  );
}

export function AIImageManager({ images: initial }: { images: string[] }) {
  const [images, setImages] = useState(initial);
  const [reorderMode, setReorderMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setImages(imgs => {
        const oldIdx = imgs.indexOf(active.id as string);
        const newIdx = imgs.indexOf(over.id as string);
        return arrayMove(imgs, oldIdx, newIdx);
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/ai-images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(images),
      });
      if (res.ok) { toast.success('Order saved'); setReorderMode(false); router.refresh(); }
      else toast.error('Failed to save order');
    } catch { toast.error('Failed to save order'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (image: string) => {
    if (!confirm('Remove this AI image?')) return;
    try {
      const res = await fetch('/api/admin/ai-images', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      });
      if (res.ok) { toast.success('Removed'); setImages(imgs => imgs.filter(i => i !== image)); router.refresh(); }
      else toast.error('Failed to remove');
    } catch { toast.error('Failed to remove'); }
  };

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center justify-between mb-6 border border-white/[0.07] bg-white/[0.02] px-5 py-3.5 rounded-lg">
        <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase">
          {reorderMode ? 'Drag images to reorder' : `${images.length} images`}
        </p>
        <div className="flex gap-2">
          {reorderMode && (
            <button onClick={handleSave} disabled={saving}
              className="bg-white text-black text-[10px] font-bold tracking-[0.3em] uppercase px-4 py-2 hover:bg-white/90 transition-colors disabled:opacity-50 rounded">
              {saving ? 'Saving...' : 'Save Order'}
            </button>
          )}
          <button
            onClick={() => { if (reorderMode) setImages(initial); setReorderMode(v => !v); }}
            className={`text-[10px] font-bold tracking-[0.3em] uppercase px-4 py-2 transition-colors rounded ${
              reorderMode ? 'border border-white/20 text-white/60 hover:text-white' : 'bg-white text-black hover:bg-white/90'
            }`}>
            {reorderMode ? 'Cancel' : 'Reorder'}
          </button>
        </div>
      </div>

      {reorderMode ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-1.5">
              {images.map(img => <SortableItem key={img} id={img} />)}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-1.5">
          {images.map(img => (
            <div key={img} className="group relative aspect-square overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-white/15 rounded">
              <Image src={img} alt="AI" fill className="object-cover" sizes="15vw" unoptimized={shouldSkipOptimization(img)} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center">
                <button onClick={() => handleDelete(img)}
                  className="px-3 py-1.5 text-[9px] tracking-[0.2em] uppercase text-red-400/80 hover:text-red-400 border border-red-400/20 hover:border-red-400/40 hover:bg-red-400/10 transition-colors rounded">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-24 border border-white/[0.05] rounded-lg">
          <p className="text-white/20 text-[10px] tracking-[0.4em] uppercase mb-3">No AI images</p>
          <p className="text-white/15 text-xs">Add images to /public/ai-images and seed from Settings</p>
        </div>
      )}
    </div>
  );
}
