'use client';

import { useState, useRef, useCallback } from 'react';
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

interface UploadProgress {
  fileName: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  originalSize?: number;
  optimizedSize?: number;
  error?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

const MAX_CLIENT_SIZE = 3.5 * 1024 * 1024; // 3.5MB — stay under Vercel's 4.5MB limit
const MAX_CLIENT_DIMENSION = 3000;

async function compressImage(file: File): Promise<File> {
  // If already small enough, skip compression
  if (file.size <= MAX_CLIENT_SIZE) return file;

  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;

      // Scale down if needed
      if (width > MAX_CLIENT_DIMENSION || height > MAX_CLIENT_DIMENSION) {
        const ratio = Math.min(MAX_CLIENT_DIMENSION / width, MAX_CLIENT_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(file); return; }
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return; }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
        },
        'image/jpeg',
        0.85
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')); };
    img.src = url;
  });
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
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadProgress[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef(false);

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
    } catch {
      toast.error('Failed to save order');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (image: string) => {
    if (!confirm('Delete this image permanently?')) return;

    setIsDeleting(image);
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: image, photographerId }),
      });

      if (res.ok) {
        setImages(prev => prev.filter(img => img !== image));
        toast.success('Image deleted');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Delete failed');
      }
    } catch {
      toast.error('Delete failed');
    } finally {
      setIsDeleting(null);
    }
  };

  // Upload logic
  const uploadFiles = useCallback(async (files: File[]) => {
    const imageFiles = files.filter(f =>
      ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/tiff', 'image/avif', 'image/heic', 'image/heif'].includes(f.type)
    );

    if (imageFiles.length === 0) {
      toast.error('No valid image files selected');
      return;
    }

    abortRef.current = false;
    setIsUploading(true);

    const queue: UploadProgress[] = imageFiles.map(f => ({
      fileName: f.name,
      status: 'pending' as const,
    }));
    setUploadQueue(queue);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < imageFiles.length; i++) {
      if (abortRef.current) break;

      // Update status to uploading
      setUploadQueue(prev => prev.map((item, idx) =>
        idx === i ? { ...item, status: 'uploading' } : item
      ));

      // Compress on client side to stay under Vercel's 4.5MB body limit
      let fileToUpload: File;
      try {
        fileToUpload = await compressImage(imageFiles[i]);
      } catch {
        fileToUpload = imageFiles[i];
      }

      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('photographerId', photographerId);

      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setImages(prev => [...prev, data.url]);
          setUploadQueue(prev => prev.map((item, idx) =>
            idx === i ? {
              ...item,
              status: 'done',
              originalSize: data.originalSize,
              optimizedSize: data.optimizedSize,
            } : item
          ));
          successCount++;
        } else {
          const data = await res.json();
          setUploadQueue(prev => prev.map((item, idx) =>
            idx === i ? { ...item, status: 'error', error: data.error } : item
          ));
          failCount++;
        }
      } catch (err) {
        setUploadQueue(prev => prev.map((item, idx) =>
          idx === i ? { ...item, status: 'error', error: 'Network error' } : item
        ));
        failCount++;
      }
    }

    setIsUploading(false);

    if (successCount > 0) {
      toast.success(`${successCount} image${successCount > 1 ? 's' : ''} uploaded successfully`);
      router.refresh();
    }
    if (failCount > 0) {
      toast.error(`${failCount} image${failCount > 1 ? 's' : ''} failed to upload`);
    }
  }, [photographerId, router]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) uploadFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDropzoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDropzoneDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDropzoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) uploadFiles(files);
  };

  const completedCount = uploadQueue.filter(u => u.status === 'done').length;
  const totalSaved = uploadQueue
    .filter(u => u.status === 'done' && u.originalSize && u.optimizedSize)
    .reduce((sum, u) => sum + ((u.originalSize ?? 0) - (u.optimizedSize ?? 0)), 0);

  return (
    <div>
      {/* Upload Zone */}
      <div className="mb-6">
        <div
          onDragOver={handleDropzoneDragOver}
          onDragLeave={handleDropzoneDragLeave}
          onDrop={handleDropzoneDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-white bg-white/10'
              : 'border-white/20 hover:border-white/40 hover:bg-white/5'
          } ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/tiff,image/avif,image/heic,image/heif"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="text-3xl mb-3">📸</div>
          <p className="text-white font-semibold mb-1">
            {isDragOver ? 'Drop images here' : 'Click or drag & drop images to upload'}
          </p>
          <p className="text-white/40 text-sm">
            JPEG, PNG, WebP, TIFF, AVIF, HEIC — auto-converted to optimized WebP
          </p>
        </div>
      </div>

      {/* Upload Progress */}
      {uploadQueue.length > 0 && (
        <div className="mb-6 bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold">
              {isUploading
                ? `Uploading... ${completedCount}/${uploadQueue.length}`
                : `Upload complete: ${completedCount}/${uploadQueue.length}`
              }
            </div>
            <div className="flex items-center gap-3">
              {totalSaved > 0 && (
                <span className="text-xs text-green-400">
                  {formatBytes(totalSaved)} saved via optimization
                </span>
              )}
              {isUploading ? (
                <button
                  onClick={() => { abortRef.current = true; }}
                  className="px-3 py-1 text-xs bg-red-500/20 border border-red-400/30 text-red-400 rounded hover:bg-red-500/30"
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={() => setUploadQueue([])}
                  className="px-3 py-1 text-xs bg-white/10 border border-white/20 text-white/60 rounded hover:bg-white/20"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-white/10 rounded-full h-1.5 mb-3">
            <div
              className="bg-white h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / uploadQueue.length) * 100}%` }}
            />
          </div>

          {/* File list (collapsed if > 10) */}
          <div className="max-h-48 overflow-y-auto space-y-1">
            {uploadQueue.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs py-0.5">
                <span className={`w-4 text-center ${
                  item.status === 'done' ? 'text-green-400' :
                  item.status === 'error' ? 'text-red-400' :
                  item.status === 'uploading' ? 'text-yellow-400 animate-pulse' :
                  'text-white/20'
                }`}>
                  {item.status === 'done' ? '✓' :
                   item.status === 'error' ? '✕' :
                   item.status === 'uploading' ? '↑' : '·'}
                </span>
                <span className="text-white/60 truncate flex-1">{item.fileName}</span>
                {item.status === 'done' && item.originalSize && item.optimizedSize && (
                  <span className="text-white/30 flex-shrink-0">
                    {formatBytes(item.originalSize)} → {formatBytes(item.optimizedSize)}
                  </span>
                )}
                {item.status === 'error' && (
                  <span className="text-red-400 flex-shrink-0">{item.error}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
                  disabled={isDeleting === image}
                  className="px-3 py-2 bg-red-500/20 border border-red-400/30 text-red-400 text-sm font-semibold rounded hover:bg-red-500/30 transition-colors disabled:opacity-50"
                >
                  {isDeleting === image ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && !isUploading && uploadQueue.length === 0 && (
        <div className="text-center py-24 border border-white/10 rounded-lg">
          <p className="text-white/50 text-lg mb-2">No images yet</p>
          <p className="text-sm text-white/30">Upload images using the drop zone above</p>
        </div>
      )}
    </div>
  );
}
