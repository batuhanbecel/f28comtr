'use client';

import { useState, useCallback } from 'react';

interface Photographer {
  fullName: string;
  title: string;
  preview: string;
}

interface Props {
  images: string[];
  photographer: Photographer;
}

async function loadImg(src: string, maxDim = 1600, quality = 0.78): Promise<{ dataUrl: string; w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
      resolve({ dataUrl: canvas.toDataURL('image/jpeg', quality), w, h });
    };
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

function placeImage(
  pdf: import('jspdf').jsPDF,
  dataUrl: string,
  natW: number,
  natH: number,
  pageW: number,
  pageH: number,
  margin: number,
) {
  const maxW = pageW - margin * 2;
  const maxH = pageH - margin * 2;
  const aspect = natW / natH;
  let w = aspect >= maxW / maxH ? maxW : maxH * aspect;
  let h = aspect >= maxW / maxH ? maxW / aspect : maxH;
  const x = (pageW - w) / 2;
  const y = (pageH - h) / 2;
  pdf.addImage(dataUrl, 'JPEG', x, y, w, h, undefined, 'FAST');
}

export function DownloadPortfolio({ images, photographer }: Props) {
  const [phase, setPhase] = useState<'idle' | 'working' | 'done'>('idle');
  const [progress, setProgress] = useState(0);

  const generate = useCallback(async () => {
    setPhase('working');
    setProgress(0);

    try {
      const { default: jsPDF } = await import('jspdf');
      const PW = 210; // A4 portrait mm
      const PH = 297;
      const M = 14;

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      // ── COVER ─────────────────────────────────────────────────────
      const coverSplit = PH * 0.62; // image occupies top 62%
      setProgress(2);

      const cover = await loadImg(photographer.preview, 2200, 0.88);
      setProgress(6);

      // Black base
      pdf.setFillColor(0, 0, 0);
      pdf.rect(0, 0, PW, PH, 'F');

      // Preview image — fills top portion, cropped to width
      const coverAspect = cover.w / cover.h;
      const coverImgH = PW / coverAspect;
      // If image is taller than the split area, position so it fills width and clips at split
      const coverY = 0;
      pdf.addImage(cover.dataUrl, 'JPEG', 0, coverY, PW, Math.min(coverImgH, coverSplit), undefined, 'FAST');

      // Thin separator line
      pdf.setDrawColor(30, 30, 30);
      pdf.setLineWidth(0.3);
      pdf.line(M, coverSplit + 0.15, PW - M, coverSplit + 0.15);

      // Text in lower section
      const ty = coverSplit + 22;
      pdf.setTextColor(70, 70, 70);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.text(photographer.title.toUpperCase(), M, ty);

      pdf.setTextColor(240, 240, 240);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(26);
      pdf.text(photographer.fullName.toUpperCase(), M, ty + 14);

      pdf.setTextColor(50, 50, 50);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.text(`${String(images.length).padStart(2, '0')} IMAGES`, M, ty + 26);

      // f/2.8 logo — bottom right
      const logo = await loadImg('/logos/f28/f28_white.png', 500, 0.92);
      const logoW = 24;
      const logoH = (logoW * logo.h) / logo.w;
      pdf.addImage(
        logo.dataUrl, 'PNG',
        PW - M - logoW, PH - M - logoH,
        logoW, logoH, undefined, 'FAST',
      );
      setProgress(10);

      // ── PORTFOLIO PAGES ───────────────────────────────────────────
      for (let i = 0; i < images.length; i++) {
        pdf.addPage();
        pdf.setFillColor(0, 0, 0);
        pdf.rect(0, 0, PW, PH, 'F');

        const img = await loadImg(images[i], 1600, 0.75);
        placeImage(pdf, img.dataUrl, img.w, img.h, PW, PH, M);

        // Page counter — bottom right
        pdf.setTextColor(45, 45, 45);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(6);
        pdf.text(
          `${String(i + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}`,
          PW - M, PH - 7, { align: 'right' },
        );

        setProgress(10 + Math.round(((i + 1) / images.length) * 84));
      }

      // ── END PAGE ──────────────────────────────────────────────────
      pdf.addPage();
      pdf.setFillColor(0, 0, 0);
      pdf.rect(0, 0, PW, PH, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(36);
      pdf.text('THANK YOU', PW / 2, PH / 2 - 12, { align: 'center' });

      const logoEnd = await loadImg('/logos/f28/f28_white.png', 500, 0.92);
      const leW = 28;
      const leH = (leW * logoEnd.h) / logoEnd.w;
      pdf.addImage(
        logoEnd.dataUrl, 'PNG',
        (PW - leW) / 2, PH / 2 + 6,
        leW, leH, undefined, 'FAST',
      );

      setProgress(100);

      const slug = photographer.fullName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      pdf.save(`${slug}-portfolio.pdf`);

      setPhase('done');
      setTimeout(() => { setPhase('idle'); setProgress(0); }, 3500);
    } catch (err) {
      console.error('PDF generation failed:', err);
      setPhase('idle');
      setProgress(0);
    }
  }, [images, photographer]);

  return (
    <button
      onClick={generate}
      disabled={phase === 'working'}
      className="inline-flex items-center gap-3 text-white/35 text-[10px] tracking-[0.4em] uppercase hover:text-white/70 border border-white/[0.12] hover:border-white/30 px-6 py-3 transition-all duration-300 disabled:cursor-wait disabled:opacity-60 mt-4 fade-in-up"
      style={{ animationDelay: '0.35s' }}
    >
      {phase === 'idle' && (
        <>
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="square" d="M12 3v13M7 12l5 5 5-5M4 20h16" />
          </svg>
          Download Portfolio
        </>
      )}
      {phase === 'working' && (
        <>
          <span className="w-3.5 h-3.5 flex-shrink-0 border border-white/20 border-t-white/60 rounded-full animate-spin" />
          {progress < 10 ? 'Preparing…' : `Building PDF… ${progress}%`}
        </>
      )}
      {phase === 'done' && (
        <>
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="square" d="M5 13l4 4L19 7" />
          </svg>
          Downloaded
        </>
      )}
    </button>
  );
}
