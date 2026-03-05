'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface PhotographerImageGalleryProps {
  images: string[];
  photographerId: string;
  photographerName: string;
}

function SortableImage({ id, image, photographerName }: { id: string; image: string; photographerName: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative aspect-square overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 rounded-lg cursor-move group"
    >
      <Image
        src={image}
        alt={photographerName}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
        <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-semibold">
          Drag to reorder
        </span>
      </div>
    </div>
  );
}

export function PhotographerImageGallery({ images: initialImages, photographerId, photographerName }: PhotographerImageGalleryProps) {
  const [images, setImages] = useState(initialImages);
  const [isSaving, setIsSaving] = useState(false);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/photographers/${photographerId}/images`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images }),
      });

      if (res.ok) {
        toast.success('Order saved successfully');
        setIsReorderMode(false);
        router.refresh();
      } else {
        toast.error('Failed to save order');
      }
    } catch (error) {
      toast.error('Failed to save order');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (image: string) => {
    if (!confirm('Remove this image from the portfolio?')) return;

    setImages(prev => prev.filter(img => img !== image));
    toast.success('Image removed. Click "Save Order" to apply changes.');
  };

  return (
    <div>
      {/* Controls */}
      <div className="mb-6 flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="text-sm text-white/50">
          {isReorderMode ? 'Drag images to reorder them' : `${images.length} portfolio images`}
        </div>
        <div className="flex gap-2">
          {isReorderMode && (
            <button
              onClick={handleSaveOrder}
              disabled={isSaving}
              className="px-4 py-2 bg-white text-black font-semibold rounded hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Order'}
            </button>
          )}
          <button
            onClick={() => {
              if (isReorderMode) {
                setImages(initialImages);
              }
              setIsReorderMode(!isReorderMode);
            }}
            className={`px-4 py-2 font-semibold rounded transition-colors ${
              isReorderMode
                ? 'bg-white/10 border border-white/20 hover:bg-white/20'
                : 'bg-white text-black hover:bg-white/90'
            }`}
          >
            {isReorderMode ? 'Cancel' : 'Reorder Images'}
          </button>
        </div>
      </div>

      {/* Gallery */}
      {isReorderMode ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {images.map((image) => (
                <SortableImage key={image} id={image} image={image} photographerName={photographerName} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((image) => (
            <div
              key={image}
              className="relative aspect-square overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 rounded-lg group"
            >
              <Image
                src={image}
                alt={photographerName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center">
                <button
                  onClick={() => handleDelete(image)}
                  className="px-3 py-2 bg-red-500/20 border border-red-400/30 text-red-400 text-sm font-semibold rounded hover:bg-red-500/30 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-24 border border-white/10 rounded-lg">
          <p className="text-white/50 mb-4">No images found</p>
          <p className="text-sm text-white/30">Add images to public/portfolios/{photographerId} and seed from files</p>
        </div>
      )}
    </div>
  );
}
