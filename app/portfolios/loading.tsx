export default function PortfoliosLoading() {
  return (
    <main className="min-h-screen bg-black">
      <div className="relative z-10 lg:w-[58%] pt-36 pb-24">
        <div className="px-8 md:px-16 mb-16">
          <div className="h-2 w-16 bg-white/10 mb-4 animate-pulse" />
          <div className="h-16 w-60 bg-white/[0.05] animate-pulse" />
          <div className="h-2 w-28 bg-white/[0.03] mt-4 animate-pulse" />
        </div>

        <div className="mx-8 md:mx-16 h-px bg-white/10" />

        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="border-b border-white/[0.07] px-8 md:px-16 py-10">
            <div
              className="h-10 bg-white/[0.03] animate-pulse"
              style={{ width: `${46 + (i % 5) * 9}%`, animationDelay: `${i * 0.055}s` }}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
