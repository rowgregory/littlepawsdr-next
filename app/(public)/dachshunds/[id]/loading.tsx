export default function Loading() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark"
      aria-busy="true"
      aria-label="Loading dog details"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-24 sm:pb-32">
        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 mb-8" aria-hidden="true">
          <div className="h-3 w-12 bg-surface-light dark:bg-surface-dark animate-pulse" />
          <span className="text-muted-light dark:text-muted-dark">/</span>
          <div className="h-3 w-20 bg-surface-light dark:bg-surface-dark animate-pulse" />
          <span className="text-muted-light dark:text-muted-dark">/</span>
          <div className="h-3 w-40 bg-surface-light dark:bg-surface-dark animate-pulse" />
        </div>

        {/* ── Two-column ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start" aria-hidden="true">
          {/* LEFT — gallery */}
          <div className="space-y-3">
            <div className="aspect-square bg-surface-light dark:bg-surface-dark animate-pulse" />
            <div className="grid grid-cols-5 gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="aspect-square bg-surface-light dark:bg-surface-dark animate-pulse" />
              ))}
            </div>
          </div>

          {/* RIGHT — info */}
          <div className="space-y-8">
            {/* Eyebrow + name + subline */}
            <div className="space-y-4">
              <div className="h-3 w-56 bg-surface-light dark:bg-surface-dark animate-pulse" />
              <div className="space-y-2">
                <div className="h-10 sm:h-12 w-full bg-surface-light dark:bg-surface-dark animate-pulse" />
                <div className="h-10 sm:h-12 w-2/3 bg-surface-light dark:bg-surface-dark animate-pulse" />
              </div>
              <div className="h-4 w-4/5 bg-surface-light dark:bg-surface-dark animate-pulse" />
            </div>

            {/* Compatibility */}
            <div className="space-y-4">
              <div className="h-3 w-32 bg-surface-light dark:bg-surface-dark animate-pulse" />
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 border border-border-light dark:border-border-dark p-4"
                  >
                    <div className="shrink-0 w-1.5 h-1.5 bg-surface-light dark:bg-surface-dark animate-pulse" />
                    <div className="h-3 w-24 bg-surface-light dark:bg-surface-dark animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* Adoption fee card */}
            <div className="border border-border-light dark:border-border-dark p-6 space-y-5">
              <div className="h-3 w-28 bg-surface-light dark:bg-surface-dark animate-pulse" />
              <div className="h-9 w-24 bg-surface-light dark:bg-surface-dark animate-pulse" />
              <div className="h-12 w-full bg-surface-light dark:bg-surface-dark animate-pulse" />
              <div className="h-12 w-full border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark animate-pulse" />
            </div>
          </div>
        </div>

        {/* ── At a Glance — full-width spec grid ── */}
        <div className="mt-12 sm:mt-16 space-y-5" aria-hidden="true">
          <div className="h-3 w-40 bg-surface-light dark:bg-surface-dark animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border border-border-light dark:border-border-dark p-4 space-y-2">
                <div className="h-2.5 w-16 bg-surface-light dark:bg-surface-dark animate-pulse" />
                <div className="h-4 w-32 bg-surface-light dark:bg-surface-dark animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* ── About — full-width text block ── */}
        <div className="mt-12 sm:mt-16 space-y-5" aria-hidden="true">
          <div className="h-3 w-64 bg-surface-light dark:bg-surface-dark animate-pulse" />
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`h-3 bg-surface-light dark:bg-surface-dark animate-pulse ${i === 7 ? 'w-1/2' : 'w-full'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <span className="sr-only" role="status" aria-live="polite">
        Loading dog details…
      </span>
    </main>
  )
}
