export default function ProductionLoading() {
  return (
    <main className="min-h-screen bg-black">
      <section className="min-h-screen flex flex-col items-center justify-center px-6 md:px-12">
        <div className="flex flex-col items-center gap-5 w-full max-w-5xl">
          <div className="h-2 w-28 bg-white/10 animate-pulse" />
          <div className="h-16 md:h-24 w-72 md:w-[420px] bg-white/[0.05] animate-pulse" />
          <div className="h-2.5 w-full max-w-xl bg-white/[0.04] animate-pulse mt-4" />
          <div className="h-2.5 w-4/5 max-w-xl bg-white/[0.03] animate-pulse" />
          <div className="h-2.5 w-3/5 max-w-xl bg-white/[0.025] animate-pulse" />
        </div>
      </section>
    </main>
  );
}
