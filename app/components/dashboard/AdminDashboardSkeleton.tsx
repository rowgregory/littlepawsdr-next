export function AdminDashboardSkeleton() {
  return (
    <div className="w-full">
      {/* Header */}
      <header className="border-b border-border-light dark:border-border-dark px-4 sm:px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="h-3.5 w-24 bg-border-light dark:bg-border-dark animate-pulse" />
          <div className="h-2.5 w-48 bg-border-light dark:bg-border-dark animate-pulse" />
        </div>
        <div className="lg:max-w-md w-full space-y-1.5">
          <div className="w-full h-14 bg-border-light dark:bg-border-dark animate-pulse" />
          <div className="h-2.5 w-28 bg-border-light dark:bg-border-dark animate-pulse" />
        </div>
      </header>

      <div className="px-4 sm:px-6 py-6 pb-12">
        {/* Total revenue */}
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-5 sm:p-6 mb-5">
          <div className="h-2.5 w-36 bg-border-light dark:bg-border-dark animate-pulse mb-2" />
          <div className="h-12 w-52 bg-border-light dark:bg-border-dark animate-pulse" />
          <div className="h-2.5 w-44 bg-border-light dark:bg-border-dark animate-pulse mt-3" />
        </div>

        {/* Revenue by source */}
        <div className="h-2.5 w-32 bg-border-light dark:bg-border-dark animate-pulse mb-2.5" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3.5 h-3.5 bg-border-light dark:bg-border-dark animate-pulse shrink-0" />
                <div className="h-2 w-16 bg-border-light dark:bg-border-dark animate-pulse" />
              </div>
              <div className="h-7 w-20 bg-border-light dark:bg-border-dark animate-pulse" />
            </div>
          ))}
        </div>

        {/* Revenue trend chart */}
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-5 sm:p-6 mb-6">
          <div className="h-2.5 w-32 bg-border-light dark:bg-border-dark animate-pulse mb-1" />
          <div className="h-2.5 w-24 bg-border-light dark:bg-border-dark animate-pulse mb-4" />
          <div className="h-48 w-full bg-border-light dark:bg-border-dark animate-pulse" />
        </div>

        {/* Welcome Wieners */}
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-5 sm:p-6">
          <div className="flex items-center justify-between mb-1">
            <div className="h-2.5 w-32 bg-border-light dark:bg-border-dark animate-pulse" />
            <div className="h-2.5 w-20 bg-border-light dark:bg-border-dark animate-pulse" />
          </div>
          <div className="h-2.5 w-48 bg-border-light dark:bg-border-dark animate-pulse mb-4" />
          <div className="flex flex-col gap-3.5">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="h-3 w-28 bg-border-light dark:bg-border-dark animate-pulse" />
                  <div className="h-2.5 w-32 bg-border-light dark:bg-border-dark animate-pulse" />
                </div>
                <div className="h-2 w-full bg-bg-light dark:bg-bg-dark">
                  <div
                    className="h-2 bg-border-light dark:bg-border-dark animate-pulse"
                    style={{ width: `${[75, 50, 90, 35][i]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
