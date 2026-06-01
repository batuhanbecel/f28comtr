export function MasonryGridSkeleton() {
  return (
    <div className="editorial-grid grid-cols-2 lg:grid-cols-4 px-1">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="editorial-panel bg-th-fg/[0.04] animate-pulse !border-th-fg/[0.06]"
          style={{
            aspectRatio: i % 3 === 0 ? '3/4' : i % 2 === 0 ? '1/1' : '4/3',
            animationDelay: `${i * 40}ms`,
          }}
        />
      ))}
    </div>
  );
}
