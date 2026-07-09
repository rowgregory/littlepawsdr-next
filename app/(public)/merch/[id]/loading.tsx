export default function Loading() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark"
      aria-busy="true"
      aria-label="Loading product"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-32">
        {/* ── Back ── */}
        <div className="mb-8">
          <div className="h-3 w-24 bg-surface-light dark:bg-surface-dark animate-pulse" aria-hidden="true" />
        </div>

        {/* ── Two-column ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start" aria-hidden="true">
          {/* LEFT — gallery */}
          <div className="space-y-3">
            <div className="aspect-square bg-surface-light dark:bg-surface-dark animate-pulse" />
            <div className="flex gap-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="w-16 h-16 bg-surface-light dark:bg-surface-dark animate-pulse" />
              ))}
            </div>
          </div>

          {/* RIGHT — info */}
          <div className="space-y-6">
            {/* Eyebrow */}
            <div className="h-3 w-20 bg-surface-light dark:bg-surface-dark animate-pulse" />

            {/* Name (two lines) */}
            <div className="space-y-2">
              <div className="h-9 sm:h-10 w-full bg-surface-light dark:bg-surface-dark animate-pulse" />
              <div className="h-9 sm:h-10 w-1/2 bg-surface-light dark:bg-surface-dark animate-pulse" />
            </div>

            {/* Price */}
            <div className="h-7 w-28 bg-surface-light dark:bg-surface-dark animate-pulse" />

            {/* Description */}
            <div className="space-y-2 pt-2">
              <div className="h-3 w-full bg-surface-light dark:bg-surface-dark animate-pulse" />
              <div className="h-3 w-full bg-surface-light dark:bg-surface-dark animate-pulse" />
              <div className="h-3 w-2/3 bg-surface-light dark:bg-surface-dark animate-pulse" />
            </div>

            {/* Quantity */}
            <div className="space-y-3 pt-2">
              <div className="h-2.5 w-20 bg-surface-light dark:bg-surface-dark animate-pulse" />
              <div className="h-12 w-32 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark animate-pulse" />
            </div>

            {/* Add to cart */}
            <div className="h-12 w-48 bg-surface-light dark:bg-surface-dark animate-pulse mt-2" />
          </div>
        </div>
      </div>

      <span className="sr-only" role="status" aria-live="polite">
        Loading product…
      </span>
    </main>
  )
}
