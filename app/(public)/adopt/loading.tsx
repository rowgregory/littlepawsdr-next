export default function PreApplicationSkeleton() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark"
      aria-busy="true"
      aria-label="Loading adoption application"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-32">
        {/* ── Header — matches the application page (left-aligned) ── */}
        <div className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-8 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
              Adoption
            </p>
          </div>
          {/* Title */}
          <div
            className="h-11 sm:h-14 w-80 bg-surface-light dark:bg-surface-dark animate-pulse mb-5"
            aria-hidden="true"
          />
          {/* Description */}
          <div className="space-y-2" aria-hidden="true">
            <div className="h-4 w-full bg-surface-light dark:bg-surface-dark animate-pulse" />
            <div className="h-4 w-full bg-surface-light dark:bg-surface-dark animate-pulse" />
            <div className="h-4 w-2/3 bg-surface-light dark:bg-surface-dark animate-pulse" />
          </div>
        </div>

        {/* ── Below the header, the two pages differ — this is the flow's stepper + card ── */}
        <div className="flex items-start justify-center mb-8" aria-hidden="true">
          {['Sign In', 'Terms', 'Info', 'Payment'].map((label, i) => (
            <div key={label} className="flex items-start flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div className="w-9 h-9 bg-surface-light dark:bg-surface-dark animate-pulse" />
                <div className="h-2 w-12 bg-surface-light dark:bg-surface-dark animate-pulse" />
              </div>
              {i < 3 && <div className="flex-1 h-px bg-border-light dark:bg-border-dark mt-4.5 mx-2" />}
            </div>
          ))}
        </div>

        <div
          className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-6 sm:p-8"
          aria-hidden="true"
        >
          <div className="h-8 w-56 bg-bg-light dark:bg-bg-dark animate-pulse mb-6" />
          <div className="space-y-6 mb-8">
            {[4, 4].map((count, g) => (
              <div key={g} className="space-y-3">
                <div className="h-2.5 w-40 bg-bg-light dark:bg-bg-dark animate-pulse" />
                {Array.from({ length: count }).map((_, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 bg-primary-light/40 dark:bg-primary-dark/40 shrink-0 mt-1.5" />
                    <div
                      className="h-3 bg-bg-light dark:bg-bg-dark animate-pulse"
                      style={{ width: `${55 + ((i * 13) % 35)}%` }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="border-t border-border-light dark:border-border-dark pt-6 space-y-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-6 bg-bg-light dark:bg-bg-dark animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-full bg-bg-light dark:bg-bg-dark animate-pulse" />
                <div className="h-3 w-3/4 bg-bg-light dark:bg-bg-dark animate-pulse" />
              </div>
            </div>
            <div className="h-12 w-full bg-bg-light dark:bg-bg-dark animate-pulse" />
          </div>
        </div>
      </div>

      <span className="sr-only" role="status" aria-live="polite">
        Loading application…
      </span>
    </main>
  )
}
