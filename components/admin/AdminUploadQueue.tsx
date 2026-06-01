'use client';

interface UploadProgress {
  fileName: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
}

interface AdminUploadQueueProps {
  queue: UploadProgress[];
  isUploading: boolean;
  onCancel: () => void;
  className?: string;
}

export function AdminUploadQueue({ queue, isUploading, onCancel, className = 'mb-6' }: AdminUploadQueueProps) {
  if (queue.length === 0) return null;

  const doneCount = queue.filter((item) => item.status === 'done').length;

  return (
    <div className={`${className} border border-th-fg/[0.08] divide-y divide-th-fg/[0.05] max-h-48 overflow-y-auto`}>
      {isUploading ? (
        <div className="px-4 py-2 flex justify-between items-center bg-th-fg/[0.02]">
          <span className="text-th-fg/40 text-[10px] tracking-widest uppercase">
            Uploading {doneCount}/{queue.length}
          </span>
          <button
            onClick={onCancel}
            className="text-red-400/60 hover:text-red-400 text-[10px] tracking-widest uppercase"
          >
            Cancel
          </button>
        </div>
      ) : null}
      {queue.map((item, i) => (
        <div key={`${item.fileName}-${i}`} className="px-4 py-2 flex items-center justify-between text-xs">
          <span className="text-th-fg/50 truncate max-w-[60%]">{item.fileName}</span>
          <span
            className={`text-[10px] tracking-wider ${
              item.status === 'done'
                ? 'text-green-400/70'
                : item.status === 'error'
                  ? 'text-red-400/70'
                  : item.status === 'uploading'
                    ? 'text-th-fg/50'
                    : 'text-th-fg/20'
            }`}
          >
            {item.status === 'uploading'
              ? 'Uploading...'
              : item.status === 'done'
                ? '✓'
                : item.status === 'error'
                  ? item.error || 'Failed'
                  : 'Pending'}
          </span>
        </div>
      ))}
    </div>
  );
}
