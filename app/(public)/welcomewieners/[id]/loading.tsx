import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function Loading() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark"
      aria-busy="true"
      aria-label="Loading dog details"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-32">
        {/* ── Back (real, static) ── */}
        <div className="mb-8">
          <Link
            href="/welcomewieners"
            className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            <ChevronLeft className="w-3 h-3" aria-hidden="true" />
            All Dogs
          </Link>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-16 items-start" aria-hidden="true">
          {/* LEFT — image gallery */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="aspect-square bg-surface-light dark:bg-surface-dark animate-pulse" />
            {/* Thumbnail row */}
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square bg-surface-light dark:bg-surface-dark animate-pulse" />
              ))}
            </div>
          </div>

          {/* RIGHT — info + products */}
          <div className="space-y-8">
            {/* Eyebrow + name + age */}
            <div className="space-y-4">
              <div className="h-3 w-28 bg-surface-light dark:bg-surface-dark animate-pulse" />
              <div className="h-10 sm:h-12 w-3/5 bg-surface-light dark:bg-surface-dark animate-pulse" />
              <div className="h-4 w-1/3 bg-surface-light dark:bg-surface-dark animate-pulse" />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <div className="h-3 w-full bg-surface-light dark:bg-surface-dark animate-pulse" />
              <div className="h-3 w-full bg-surface-light dark:bg-surface-dark animate-pulse" />
              <div className="h-3 w-4/5 bg-surface-light dark:bg-surface-dark animate-pulse" />
            </div>

            {/* Divider */}
            <div className="h-px bg-border-light dark:bg-border-dark" />

            {/* Donation products */}
            <div className="space-y-4">
              <div className="h-3 w-32 bg-surface-light dark:bg-surface-dark animate-pulse" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 border border-border-light dark:border-border-dark p-4"
                  >
                    {/* Product icon/thumb */}
                    <div className="shrink-0 w-12 h-12 bg-surface-light dark:bg-surface-dark animate-pulse" />
                    {/* Name + desc */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="h-4 w-1/2 bg-surface-light dark:bg-surface-dark animate-pulse" />
                      <div className="h-3 w-3/4 bg-surface-light dark:bg-surface-dark animate-pulse" />
                    </div>
                    {/* Price / add button */}
                    <div className="shrink-0 h-9 w-20 bg-surface-light dark:bg-surface-dark animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <span className="sr-only" role="status" aria-live="polite">
        Loading dog details…
      </span>
    </main>
  )
}
