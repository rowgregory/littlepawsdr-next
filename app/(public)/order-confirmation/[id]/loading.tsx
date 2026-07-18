export default function OrderConfirmationSkeleton() {
  return (
    <div className="min-h-dvh bg-white dark:bg-bg-dark">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 dark:border-border-dark bg-white/90 dark:bg-bg-dark/90 backdrop-blur-sm">
        <div className="px-4 430:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-4 h-px bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-2 w-40 bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
          </div>
          <div className="h-2 w-16 bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 430:px-6 pt-24 430:pt-28 pb-12 430:pb-16">
        {/* Hero — icon + heading */}
        <div className="mb-10 flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
          <div className="flex-1 space-y-2.5">
            <div className="h-2 w-28 bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
            <div className="h-8 w-72 bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
            <div className="h-3 w-80 bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            <div className="h-3 w-56 bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
          </div>
        </div>

        {/* Receipt card */}
        <div className="border border-zinc-200 dark:border-border-dark mb-6">
          {/* Receipt header */}
          <div className="px-5 py-3.5 border-b border-zinc-200 dark:border-border-dark flex items-center justify-between">
            <div className="h-2.5 w-16 bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
            <div className="h-2.5 w-20 bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
          </div>

          {/* Item row */}
          <div className="px-5 py-4 flex items-center gap-4 border-b border-zinc-200 dark:border-border-dark">
            <div className="shrink-0 w-12 h-12 bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-40 bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
              <div className="h-2.5 w-12 bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
              <div className="h-2.5 w-32 bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            </div>
            <div className="h-3 w-14 bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
          </div>

          {/* Total row */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-border-dark">
            <div className="h-3 w-10 bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
            <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
          </div>

          {/* Meta rows */}
          <div className="px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-2.5 w-10 bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
              <div className="h-2.5 w-40 bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            </div>
            <div className="flex items-center justify-between">
              <div className="h-2.5 w-8 bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
              <div className="h-2.5 w-24 bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Confirmation email notice */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-l-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-surface-dark mb-6">
          <div className="w-4 h-4 bg-zinc-200 dark:bg-zinc-700 animate-pulse shrink-0" />
          <div className="h-2.5 w-64 bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
        </div>

        {/* CTA buttons */}
        <div className="space-y-3">
          <div className="h-12 w-full bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
          <div className="h-12 w-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
