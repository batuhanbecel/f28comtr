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
  const attempt = (useCors: boolean): Promise<{ dataUrl: string; w: number; h: number }> =>
    new Promise((resolve, reject) => {
      const img = new window.Image();
      if (useCors) img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
          const w = Math.round(img.naturalWidth * scale);
          const h = Math.round(img.naturalHeight * scale);
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve({ dataUrl, w, h });
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = () => reject(new Error(`Failed to load ${src}`));
      img.src = src;
    });

  try {
    return await attempt(true);
  } catch {
    // CORS taint — retry without crossOrigin (same-origin images)
    return attempt(false);
  }
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
  const [phase, setPhase] = useState<'idle' | 'working' | 'done' | 'error'>('idle');
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
      const coverSplit = PH * 0.58; // image occupies top 58%
      setProgress(2);

      const cover = await loadImg(photographer.preview, 2200, 0.88);
      setProgress(6);

      // Black base
      pdf.setFillColor(0, 0, 0);
      pdf.rect(0, 0, PW, PH, 'F');

      // Preview image — fills width, clips at split
      const coverAspect = cover.w / cover.h;
      const coverImgH = PW / coverAspect;
      pdf.addImage(cover.dataUrl, 'JPEG', 0, 0, PW, Math.min(coverImgH, coverSplit + 10), undefined, 'FAST');

      // Fade strip at bottom of image (3 dark rects for gradient effect)
      pdf.setFillColor(0, 0, 0);
      pdf.rect(0, coverSplit - 30, PW, 40, 'F');

      // Thin white separator line — centered
      const lineW = 28;
      pdf.setDrawColor(60, 60, 60);
      pdf.setLineWidth(0.25);
      pdf.line((PW - lineW) / 2, coverSplit + 8, (PW + lineW) / 2, coverSplit + 8);

      // ── Centered text block ──
      const cx = PW / 2; // horizontal center

      // Photographer title (label)
      pdf.setTextColor(80, 80, 80);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.text(photographer.title.toUpperCase(), cx, coverSplit + 22, { align: 'center' });

      // Full name — large, bold, centered
      pdf.setTextColor(245, 245, 245);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(34);
      pdf.text(photographer.fullName.toUpperCase(), cx, coverSplit + 40, { align: 'center' });

      // Image count
      pdf.setTextColor(55, 55, 55);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.text(`${String(images.length).padStart(2, '0')}\u2002IMAGES`, cx, coverSplit + 53, { align: 'center' });

      // f/2.8 logo — centered at bottom
      const logo = await loadImg('/logos/f28/f28_white.png', 500, 0.92);
      const logoW = 26;
      const logoH = (logoW * logo.h) / logo.w;
      pdf.addImage(
        logo.dataUrl, 'PNG',
        (PW - logoW) / 2, PH - M - logoH,
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

      // Thin divider line centered
      const endLineW = 28;
      pdf.setDrawColor(45, 45, 45);
      pdf.setLineWidth(0.25);
      pdf.line((PW - endLineW) / 2, PH / 2 - 28, (PW + endLineW) / 2, PH / 2 - 28);

      // THANK YOU — large, bold, centered
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(42);
      pdf.text('THANK YOU', PW / 2, PH / 2 - 8, { align: 'center' });

      // Photographer name — smaller, below
      pdf.setTextColor(55, 55, 55);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text(photographer.fullName.toUpperCase(), PW / 2, PH / 2 + 8, { align: 'center' });

      // f/2.8 logo — centered below text
      const logoEnd = await loadImg('/logos/f28/f28_white.png', 500, 0.92);
      const leW = 26;
      const leH = (leW * logoEnd.h) / logoEnd.w;
      pdf.addImage(
        logoEnd.dataUrl, 'PNG',
        (PW - leW) / 2, PH / 2 + 22,
        leW, leH, undefined, 'FAST',
      );

      setProgress(100);

      const slug = photographer.fullName
        .toLowerCase()
        .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/i̇/g, 'i')
        .replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      // Manual blob download — avoids browser blocking after long async
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}-portfolio.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);

      setPhase('done');
      setTimeout(() => { setPhase('idle'); setProgress(0); }, 3500);
    } catch (err) {
      console.error('PDF generation failed:', err);
      setPhase('error');
      setTimeout(() => { setPhase('idle'); setProgress(0); }, 4000);
    }
  }, [images, photographer]);

  return (
    <button
      onClick={generate}
      disabled={phase === 'working'}
      className="inline-flex items-center gap-2.5 text-white/60 text-[10px] tracking-[0.4em] uppercase hover:text-white border border-white/25 hover:border-white/60 px-5 py-2.5 transition-all duration-300 disabled:cursor-wait disabled:opacity-50"
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
      {phase === 'error' && (
        <>
          <svg className="w-3.5 h-3.5 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="square" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="text-red-400">Failed — try again</span>
        </>
      )}
    </button>
  );
}
