export default function ProductionLoading() {
  return (
    <main className="min-h-screen bg-th-bg">
      <section className="hero-screen min-h-screen flex flex-col items-center justify-center section-padding">
        <div className="page-heading-stack page-heading-stack--center gap-5 w-full max-w-5xl">
          <div className="hero-rule mx-auto animate-pulse opacity-30" />
          <div className="h-6 w-28 editorial-panel animate-pulse mx-auto" />
          <div className="h-16 md:h-24 w-72 md:w-[420px] editorial-panel animate-pulse mx-auto" />
          <div className="h-2.5 w-full max-w-xl editorial-panel animate-pulse mt-4 mx-auto" />
          <div className="h-2.5 w-4/5 max-w-xl editorial-panel animate-pulse mx-auto" />
        </div>
      </section>
    </main>
  );
}
