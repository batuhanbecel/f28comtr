'use client';

import { useAdminT } from '@/hooks/useAdminT';

interface AdminDropzoneProps {
  onFiles: (files: FileList) => void;
  accept?: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
}

export function AdminDropzone({
  onFiles,
  accept,
  hint,
  disabled,
  className = '',
}: AdminDropzoneProps) {
  const a = useAdminT();
  const hintText = hint ?? a.dropzone.hint;

  return (
    <label
      className={`editorial-panel flex flex-col items-center justify-center gap-3 p-10 cursor-pointer border-dashed ${disabled ? 'opacity-50 pointer-events-none' : 'hover:border-th-fg/25'} ${className}`}
    >
      <span className="section-label">{hintText}</span>
      <span className="admin-muted text-[10px] tracking-[0.3em] uppercase">{a.dropzone.formats}</span>
      <input
        type="file"
        className="sr-only"
        accept={accept}
        multiple
        disabled={disabled}
        onChange={(e) => {
          const files = e.target.files;
          if (files?.length) onFiles(files);
          e.target.value = '';
        }}
      />
    </label>
  );
}
