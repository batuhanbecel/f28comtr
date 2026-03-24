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
  currentPreview?: string;
  onPreviewSelect?: (imageUrl: string) => void;
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
      className="relative aspect-square overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-white/20 rounded-lg cursor-move group"
    >
      <Image
        src={image}
        alt={photographerName}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
      />
      <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center">
        <span className="text-white/40 text-[9px] tracking-widest uppercase">Drag</span>
      </div>
    </div>
  );
}

export function PhotographerImageGallery({ 
  images: initialImages, 
  photographerId, 
  photographerName, 
  currentPreview,
  onPreviewSelect 
}: PhotographerImageGalleryProps) {
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
      <div className="mb-6 flex gap-2 items-center">
        <button
          onClick={() => !isUploading && fileInputRef.current?.click()}
          disabled={isUploading}
          className="text-[10px] font-bold tracking-[0.3em] uppercase px-4 py-2.5 border border-white/[0.15] text-white/60 hover:text-white hover:border-white/30 transition-colors disabled:opacity-40 rounded"
        >
          + Upload
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/tiff,image/avif,image/heic,image/heif"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <div
        onDragOver={handleDropzoneDragOver}
        onDragLeave={handleDropzoneDragLeave}
        onDrop={handleDropzoneDrop}
        className={`mb-6 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver ? 'border-white/40 bg-white/[0.06]' : 'border-white/[0.08] hover:border-white/15'
        } ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <p className="text-white/30 text-xs tracking-wide">Drop images here or click Upload</p>
      </div>

      {/* Upload Progress */}
      {uploadQueue.length > 0 && (
        <div className="mb-6 border border-white/[0.08] rounded-lg divide-y divide-white/[0.05] max-h-48 overflow-y-auto">
          <div className="px-4 py-2 flex justify-between items-center bg-white/[0.02]">
            <span className="text-white/40 text-[10px] tracking-widest uppercase">
              {isUploading
                ? `Uploading ${completedCount}/${uploadQueue.length}`
                : `Done ${completedCount}/${uploadQueue.length}`
              }
              {totalSaved > 0 && ` · ${formatBytes(totalSaved)} saved`}
            </span>
            {isUploading ? (
              <button onClick={() => { abortRef.current = true; }} className="text-red-400/60 hover:text-red-400 text-[10px] tracking-widest uppercase">Cancel</button>
            ) : (
              <button onClick={() => setUploadQueue([])} className="text-white/30 hover:text-white/60 text-[10px] tracking-widest uppercase">Dismiss</button>
            )}
          </div>
          {uploadQueue.map((item, i) => (
            <div key={i} className="px-4 py-2 flex items-center justify-between text-xs">
              <span className="text-white/50 truncate max-w-[60%]">{item.fileName}</span>
              <span className={`text-[10px] tracking-wider ${
                item.status === 'done' ? 'text-green-400/70' : item.status === 'error' ? 'text-red-400/70' : item.status === 'uploading' ? 'text-white/50' : 'text-white/20'
              }`}>
                {item.status === 'uploading' ? 'Uploading...' : item.status === 'done' ? '✓' : item.status === 'error' ? item.error || 'Failed' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="mb-6 flex items-center justify-end gap-2">
        {isReorderMode && (
          <button
            onClick={handleSaveOrder}
            disabled={isSaving}
            className="bg-white text-black text-[10px] font-bold tracking-[0.3em] uppercase px-5 py-2.5 hover:bg-white/90 transition-colors disabled:opacity-50 rounded"
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
          className={`text-[10px] font-bold tracking-[0.3em] uppercase px-4 py-2.5 transition-colors rounded ${
            isReorderMode
              ? 'bg-white/10 border border-white/20 text-white/60 hover:text-white'
              : 'border border-white/[0.15] text-white/60 hover:text-white hover:border-white/30'
          }`}
        >
          {isReorderMode ? '✕ Cancel' : 'Reorder'}
        </button>
      </div>

      {/* Gallery */}
      {isReorderMode ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1.5">
              {images.map((image) => (
                <SortableImage key={image} id={image} image={image} photographerName={photographerName} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1.5">
          {images.map((image) => (
            <div
              key={image}
              className="group relative aspect-square overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-white/20 transition-all duration-300 rounded-lg"
            >
              <Image
                src={image}
                alt={photographerName}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 15vw"
              />
              {currentPreview === image && (
                <div className="absolute top-1 left-1 bg-yellow-500/90 rounded px-1.5 py-0.5">
                  <span className="text-yellow-900 text-[9px] font-bold">⭐</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-2">
                <div className="flex justify-end gap-1">
                  {onPreviewSelect && currentPreview !== image && (
                    <button
                      onClick={() => onPreviewSelect(image)}
                      className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-yellow-400 hover:bg-yellow-500/15 transition-colors text-sm rounded"
                      title="Set as preview"
                    >⭐</button>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDelete(image)}
                    disabled={isDeleting === image}
                    className="w-6 h-6 flex items-center justify-center text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-colors text-xs rounded disabled:opacity-50"
                  >✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && !isUploading && uploadQueue.length === 0 && (
        <div className="text-center py-20 border border-white/[0.05] rounded-lg">
          <p className="text-white/20 text-xs tracking-[0.4em] uppercase">No images found</p>
          <p className="text-white/10 text-xs mt-2">Drop images above or click Upload</p>
        </div>
      )}
    </div>
  );
}
