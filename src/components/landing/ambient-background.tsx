export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* base gradient wash */}
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
      />
      {/* grid */}
      <div className="absolute inset-0 grid-bg opacity-60" />
      {/* floating orbs */}
      <div className="absolute -top-24 left-1/3 h-[420px] w-[420px] rounded-full bg-[color-mix(in_oklab,var(--brand)_45%,transparent)] blur-3xl opacity-30 animate-float-slow" />
      <div className="absolute top-40 -left-16 h-[360px] w-[360px] rounded-full bg-[oklch(0.55_0.25_285/0.35)] blur-3xl opacity-40 animate-drift" />
      <div className="absolute -top-10 -right-24 h-[400px] w-[400px] rounded-full bg-[oklch(0.6_0.22_240/0.3)] blur-3xl opacity-40 animate-float-slow" />
      {/* noise */}
      <div className="absolute inset-0 noise-bg" />
      {/* fade to page */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
}
