export default function PortfolioLoading() {
  return (
    <main className="min-h-screen bg-black">
      <section className="h-[70vh] md:h-[80vh] w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-white/[0.03] animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
          <div className="h-2 w-20 bg-white/10 animate-pulse" />
          <div className="h-14 md:h-20 w-56 md:w-80 bg-white/[0.06] animate-pulse" />
          <div className="h-2 w-24 bg-white/[0.04] animate-pulse mt-2" />
        </div>
      </section>

      <section className="py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[3px]">
          {[320, 240, 410, 260, 180, 380, 220, 305, 440, 195, 360, 275].map((h, i) => (
            <div
              key={i}
              className="bg-white/[0.04] animate-pulse"
              style={{ height: h, animationDelay: `${i * 0.04}s` }}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
