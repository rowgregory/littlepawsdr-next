export default function Loading() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark"
      aria-busy="true"
      aria-label="Loading Welcome Wieners"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-32">
        {/* ── Header ── */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-6 h-px bg-border-light dark:bg-border-dark shrink-0" aria-hidden="true" />
            <div className="h-3 w-32 bg-surface-light dark:bg-surface-dark animate-pulse" />
          </div>
          <div className="h-11 sm:h-14 w-64 sm:w-80 bg-surface-light dark:bg-surface-dark animate-pulse mb-3" />
          <div className="space-y-2 max-w-md">
            <div className="h-3 w-full bg-surface-light dark:bg-surface-dark animate-pulse" />
            <div className="h-3 w-4/5 bg-surface-light dark:bg-surface-dark animate-pulse" />
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="mb-8 flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-24 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark animate-pulse"
              aria-hidden="true"
            />
          ))}
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark overflow-hidden"
              aria-hidden="true"
            >
              {/* Image */}
              <div className="aspect-4/3 bg-bg-light dark:bg-bg-dark animate-pulse" />

              {/* Body */}
              <div className="p-5 space-y-4">
                {/* Name + age */}
                <div className="space-y-2">
                  <div className="h-5 w-2/3 bg-bg-light dark:bg-bg-dark animate-pulse" />
                  <div className="h-3 w-1/3 bg-bg-light dark:bg-bg-dark animate-pulse" />
                </div>

                {/* Product rows */}
                <div className="space-y-2 pt-2">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div
                      key={j}
                      className="h-10 w-full border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <span className="sr-only" role="status" aria-live="polite">
        Loading dachshunds...
      </span>
    </main>
  )
}
