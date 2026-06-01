/**
 * Full-coverage line-art background logo.
 * Stroke only (no fill) — very low opacity, non-interactive.
 * Continuously loops a draw-in / draw-out stroke animation.
 */
export function F28LogoBg({ opacity = 0.08 }: { opacity?: number }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none select-none"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        opacity,
      }}
    >
      <style>{`
        @keyframes f28BgLoop {
          0%   { stroke-dashoffset: 1; }
          42%  { stroke-dashoffset: 0; }
          58%  { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 1; }
        }
        .f28-bg-path {
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: f28BgLoop 10s ease-in-out infinite;
        }
        .f28-bg-path.p1 { animation-delay: 0s; }
        .f28-bg-path.p2 { animation-delay: 0.4s; }
        .f28-bg-path.p3 { animation-delay: 0.8s; }
        .f28-bg-path.p4 { animation-delay: 0.6s; }
        .f28-bg-path.p5 { animation-delay: 1.1s; }
        @media (prefers-reduced-motion: reduce) {
          .f28-bg-path {
            animation: none;
            stroke-dashoffset: 0;
          }
        }
      `}</style>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-20 -20 1122.33 681.85"
        style={{ width: '100%', height: 'auto' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <path className="f28-bg-path p1" pathLength={1} d="M925.82,641.47l-23.52-.05c-50.08-3.55-95.53-29.66-123.79-68.34-32.02-43.83-40.76-98.19-25.25-148.82,14.05-45.88,46.73-82.61,90.21-103.29-92.31-43.72-125.03-154.56-72.89-240.28C798.29,35.16,848.51,3.59,904.48.56h19.51c82.36,4.87,149.68,69.23,157.55,151.6,5.21,54.47-15.58,107.2-57.4,143.57l-20.65-23.6c58.42-50.42,63.8-138.73,11.88-195.7-50.69-55.61-136.26-60.13-192.33-10.06-60.26,53.8-61.53,147.38-1.69,202.64,24.62,22.73,57.41,36.41,91.58,36.26,87.12-.4,160.56,65.59,168.69,152.5l-.03,31.72c-7.75,82.46-74.32,145.92-155.75,151.97ZM1051.04,473.56c0-75.58-61.31-136.85-136.94-136.85s-136.94,61.27-136.94,136.85,61.31,136.85,136.94,136.85,136.94-61.27,136.94-136.85Z" />
        <path className="f28-bg-path p2" pathLength={1} d="M31.98,641.85H0S.12,157.31.12,157.31C6.66,72.8,73.55,5.7,158.16.67c7.05-1.22,13.32-.49,20.37-.07,88.69,5.3,158.4,79.48,158.04,168.01l-31.24-.05c-.13-76.2-62.29-137.86-138.64-136.98-71.74.82-133.03,58.4-134.73,131.27l-.6,193.92h150.02s-.02,31.22-.02,31.22l-149.86.02.49,253.83Z" />
        <polygon className="f28-bg-path p3" pathLength={1} points="246.84 641.85 207.98 641.85 482.83 275.72 521.9 275.97 246.84 641.85" />
        <path className="f28-bg-path p4" pathLength={1} d="M713.35,641.85h-336.61s292.88-391.03,292.88-391.03c33.71-44.92,36.78-105.79,7.44-153.65-28.25-46.08-81.77-72.17-136.41-64.21-67.51,9.84-117.59,68.04-117.43,135.69l-31.3-.04c-.2-88.96,69.84-163.12,158.9-168.06l19.3.02c58.62,3.24,110.57,37.81,137.4,86.65,30.41,55.36,27.2,120.65-5.66,172.17l-6.15,8.76-256.75,342.24h274.04s.33,31.46.33,31.46Z" />
        <polygon className="f28-bg-path p5" pathLength={1} points="761.3 641.84 728.34 641.84 728.32 610.38 761.56 610.38 761.3 641.84" />
      </svg>
    </span>
  );
}
