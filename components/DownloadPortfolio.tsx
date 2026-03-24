'use client';

import { useState, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useLanguage } from '@/context/LanguageContext';

interface Photographer {
  fullName: string;
  title: string;
  preview: string;
}

interface Props {
  images: string[];
  photographer: Photographer;
}

interface Img {
  dataUrl: string;
  w: number;
  h: number;
  aspect: number;
}

// ── Image loader with CORS fallback ──────────────────────────────────────
async function loadImg(src: string, maxDim = 1600, quality = 0.78): Promise<Img> {
  const attempt = (useCors: boolean): Promise<Img> =>
    new Promise((resolve, reject) => {
      const img = new window.Image();
      if (useCors) img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
          const w = Math.round(img.naturalWidth * scale);
          const h = Math.round(img.naturalHeight * scale);
          const c = document.createElement('canvas');
          c.width = w;
          c.height = h;
          c.getContext('2d')!.drawImage(img, 0, 0, w, h);
          resolve({ dataUrl: c.toDataURL('image/jpeg', quality), w, h, aspect: w / h });
        } catch (e) { reject(e); }
      };
      img.onerror = () => reject(new Error(`Failed to load ${src}`));
      img.src = src;
    });
  try { return await attempt(true); } catch { return attempt(false); }
}

// ── PDF constants ────────────────────────────────────────────────────────
const PW = 210;
const PH = 297;
const M = 8;
const GAP = 2;
const UW = PW - M * 2;
const UH = PH - M * 2;
type PDF = import('jspdf').jsPDF;

// ── Fit image centered in a rectangle ────────────────────────────────────
function fitImg(pdf: PDF, img: Img, rx: number, ry: number, rw: number, rh: number) {
  const ra = rw / rh;
  let w: number, h: number;
  if (img.aspect > ra) { w = rw; h = rw / img.aspect; }
  else { h = rh; w = rh * img.aspect; }
  pdf.addImage(img.dataUrl, 'JPEG', rx + (rw - w) / 2, ry + (rh - h) / 2, w, h, undefined, 'FAST');
}

// ── Group images into multi-image pages ──────────────────────────────────
function groupPages(imgs: Img[]): Img[][] {
  const pages: Img[][] = [];
  let i = 0;
  while (i < imgs.length) {
    const rem = imgs.length - i;
    // First image: full-page hero
    if (i === 0) { pages.push([imgs[i]]); i++; continue; }
    // Breathing room: occasional single feature page
    if (pages.length > 2 && (pages.length - 1) % 5 === 0 && rem > 1) {
      pages.push([imgs[i]]); i++; continue;
    }
    // Group by 4, 3, or 2
    if (rem >= 4) { pages.push(imgs.slice(i, i + 4)); i += 4; }
    else if (rem === 3) { pages.push(imgs.slice(i, i + 3)); i += 3; }
    else if (rem === 2) { pages.push(imgs.slice(i, i + 2)); i += 2; }
    else { pages.push([imgs[i]]); i++; }
  }
  return pages;
}

// ── Render a multi-image page ────────────────────────────────────────────
function renderPage(pdf: PDF, imgs: Img[], label: string) {
  pdf.addPage();
  pdf.setFillColor(0, 0, 0);
  pdf.rect(0, 0, PW, PH, 'F');

  const n = imgs.length;
  if (n === 1) {
    fitImg(pdf, imgs[0], M, M, UW, UH);
  } else if (n === 2) {
    if (imgs[0].aspect < 0.85 && imgs[1].aspect < 0.85) {
      // Both portrait → side by side
      const cw = (UW - GAP) / 2;
      fitImg(pdf, imgs[0], M, M, cw, UH);
      fitImg(pdf, imgs[1], M + cw + GAP, M, cw, UH);
    } else {
      // Stacked vertically
      const rh = (UH - GAP) / 2;
      fitImg(pdf, imgs[0], M, M, UW, rh);
      fitImg(pdf, imgs[1], M, M + rh + GAP, UW, rh);
    }
  } else if (n === 3) {
    const portraits = imgs.filter(im => im.aspect < 0.85).length;
    if (portraits >= 2) {
      // 2 stacked left + 1 tall right
      const rightW = Math.round(UW * 0.45);
      const leftW = UW - rightW - GAP;
      const halfH = (UH - GAP) / 2;
      fitImg(pdf, imgs[0], M, M, leftW, halfH);
      fitImg(pdf, imgs[1], M, M + halfH + GAP, leftW, halfH);
      fitImg(pdf, imgs[2], M + leftW + GAP, M, rightW, UH);
    } else {
      // 1 full-width top + 2 side-by-side bottom
      const topH = Math.round(UH * 0.5);
      const botH = UH - topH - GAP;
      const cw = (UW - GAP) / 2;
      fitImg(pdf, imgs[0], M, M, UW, topH);
      fitImg(pdf, imgs[1], M, M + topH + GAP, cw, botH);
      fitImg(pdf, imgs[2], M + cw + GAP, M + topH + GAP, cw, botH);
    }
  } else if (n === 4) {
    const cw = (UW - GAP) / 2;
    const rh = (UH - GAP) / 2;
    fitImg(pdf, imgs[0], M, M, cw, rh);
    fitImg(pdf, imgs[1], M + cw + GAP, M, cw, rh);
    fitImg(pdf, imgs[2], M, M + rh + GAP, cw, rh);
    fitImg(pdf, imgs[3], M + cw + GAP, M + rh + GAP, cw, rh);
  }

  // Subtle page label
  pdf.setTextColor(30, 30, 30);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(5);
  pdf.text(label, PW - M, PH - 4, { align: 'right' });
}

export function DownloadPortfolio({ images, photographer }: Props) {
  const [phase, setPhase] = useState<'idle' | 'working' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const { t } = useLanguage();
  const { t } = useLanguage();

  const generate = useCallback(async () => {
    setPhase('working');
    setProgress(0);

    try {
      const { default: jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const cx = PW / 2;

      // ── COVER PAGE ─────────────────────────────────────────────────
      setProgress(2);
      const cover = await loadImg(photographer.preview, 2200, 0.88);
      setProgress(5);

      pdf.setFillColor(0, 0, 0);
      pdf.rect(0, 0, PW, PH, 'F');

      // Cover image — top portion with solid black below
      const coverSplit = PH * 0.55;
      const coverAspect = cover.w / cover.h;
      const coverImgH = PW / coverAspect;
      pdf.addImage(cover.dataUrl, 'JPEG', 0, 0, PW, Math.min(coverImgH, coverSplit + 12), undefined, 'FAST');
      pdf.setFillColor(0, 0, 0);
      pdf.rect(0, coverSplit - 8, PW, PH - coverSplit + 8, 'F');

      // Thin separator line
      const ruleW = 32;
      pdf.setDrawColor(50, 50, 50);
      pdf.setLineWidth(0.2);
      pdf.line((PW - ruleW) / 2, coverSplit + 12, (PW + ruleW) / 2, coverSplit + 12);

      // Title label
      pdf.setTextColor(70, 70, 70);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6.5);
      pdf.text(photographer.title.toUpperCase(), cx, coverSplit + 26, { align: 'center' });

      // Photographer name
      pdf.setTextColor(240, 240, 240);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(32);
      pdf.text(photographer.fullName.toUpperCase(), cx, coverSplit + 44, { align: 'center' });

      // Image count
      pdf.setTextColor(45, 45, 45);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6);
      pdf.text(`${String(images.length).padStart(2, '0')}\u2002IMAGES`, cx, coverSplit + 57, { align: 'center' });

      // f/2.8 logo at bottom
      let logo: Img | null = null;
      try { logo = await loadImg('/logos/f28/f28_white.png', 500, 0.92); } catch { /* skip */ }
      if (logo && logo.w > 0) {
        const lw = 22, lh = (lw * logo.h) / logo.w;
        pdf.addImage(logo.dataUrl, 'PNG', (PW - lw) / 2, PH - M - lh - 8, lw, lh, undefined, 'FAST');
      }
      pdf.setTextColor(25, 25, 25);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(5);
      pdf.text('f28.com.tr', cx, PH - M, { align: 'center' });

      setProgress(8);

      // ── LOAD ALL IMAGES ────────────────────────────────────────────
      const loaded: Img[] = [];
      for (let i = 0; i < images.length; i++) {
        try {
          loaded.push(await loadImg(images[i], 1600, 0.75));
        } catch {
          console.warn(`Skipping image ${i + 1}: ${images[i]}`);
        }
        setProgress(8 + Math.round(((i + 1) / images.length) * 72));
      }

      // ── GROUP & RENDER PAGES ───────────────────────────────────────
      const pages = groupPages(loaded);
      let imgIdx = 0;
      for (let p = 0; p < pages.length; p++) {
        const group = pages[p];
        const s = imgIdx + 1;
        const e = imgIdx + group.length;
        imgIdx = e;
        const label = group.length === 1
          ? `${String(s).padStart(2, '0')} / ${String(loaded.length).padStart(2, '0')}`
          : `${String(s).padStart(2, '0')}\u2013${String(e).padStart(2, '0')} / ${String(loaded.length).padStart(2, '0')}`;
        renderPage(pdf, group, label);
        setProgress(80 + Math.round(((p + 1) / pages.length) * 14));
      }

      // ── END PAGE ───────────────────────────────────────────────────
      pdf.addPage();
      pdf.setFillColor(0, 0, 0);
      pdf.rect(0, 0, PW, PH, 'F');

      pdf.setDrawColor(40, 40, 40);
      pdf.setLineWidth(0.2);
      pdf.line((PW - ruleW) / 2, PH / 2 - 28, (PW + ruleW) / 2, PH / 2 - 28);

      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(36);
      pdf.text('THANK YOU', cx, PH / 2 - 8, { align: 'center' });

      pdf.setTextColor(50, 50, 50);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.text(photographer.fullName.toUpperCase(), cx, PH / 2 + 6, { align: 'center' });

      if (logo && logo.w > 0) {
        const lw = 22, lh = (lw * logo.h) / logo.w;
        pdf.addImage(logo.dataUrl, 'PNG', (PW - lw) / 2, PH / 2 + 22, lw, lh, undefined, 'FAST');
      }

      pdf.setTextColor(25, 25, 25);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(5);
      pdf.text('f28.com.tr', cx, PH / 2 + 44, { align: 'center' });

      setProgress(100);

      // ── DOWNLOAD ───────────────────────────────────────────────────
      const slug = photographer.fullName
        .toLowerCase()
        .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/i̇/g, 'i')
        .replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

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
      className="inline-flex items-center gap-2.5 text-th-fg/60 text-[10px] tracking-[0.4em] uppercase hover:text-th-fg border border-th-fg/25 hover:border-th-fg/55 hover:bg-th-fg/10 px-5 py-2.5 transition-all duration-300 disabled:cursor-wait disabled:opacity-50"
    >
      {phase === 'idle' && (
        <>
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="square" d="M12 3v13M7 12l5 5 5-5M4 20h16" />
          </svg>
          {t.common.downloadPortfolio}
        </>
      )}
      {phase === 'working' && (
        <>
          <span className="w-3.5 h-3.5 flex-shrink-0 border border-white/20 border-t-white/60 rounded-full animate-spin" />
          {progress < 8 ? t.common.preparing : `${t.common.buildingPdf} ${progress}%`}
        </>
      )}
      {phase === 'done' && (
        <>
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="square" d="M5 13l4 4L19 7" />
          </svg>
          {t.common.downloaded}
        </>
      )}
      {phase === 'error' && (
        <>
          <svg className="w-3.5 h-3.5 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="square" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="text-red-400">{t.common.failedRetry}</span>
        </>
      )}
    </button>
  );
}
