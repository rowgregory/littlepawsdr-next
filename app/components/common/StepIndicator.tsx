import { Check } from 'lucide-react'

export function StepIndicator({ current, labels }: { current: number; total: number; labels: string[] }) {
  return (
    <div className="mb-10" role="list" aria-label="Checkout steps">
      <div className="flex items-center gap-0">
        {labels.map((label, i) => {
          const stepNum = i + 1
          const isDone = stepNum < current
          const isActive = stepNum === current
          return (
            <div key={label} className="flex items-center flex-1 last:flex-none" role="listitem">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-6 h-6 flex items-center justify-center border-2 transition-colors duration-200
                  ${
                    isDone
                      ? 'border-primary-light dark:border-primary-dark bg-primary-light dark:bg-primary-dark'
                      : isActive
                        ? 'border-primary-light dark:border-primary-dark'
                        : 'border-border-light dark:border-border-dark'
                  }`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isDone ? (
                    <Check className="w-3 h-3 text-white" aria-hidden="true" />
                  ) : (
                    <span
                      className={`text-[10px] font-mono font-bold ${isActive ? 'text-primary-light dark:text-primary-dark' : 'text-muted-light dark:text-muted-dark'}`}
                    >
                      {stepNum}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[9px] font-mono tracking-[0.15em] uppercase whitespace-nowrap hidden sm:block
                  ${isActive ? 'text-primary-light dark:text-primary-dark' : 'text-muted-light dark:text-muted-dark'}`}
                >
                  {label}
                </span>
              </div>
              {i < labels.length - 1 && (
                <div
                  className={`flex-1 h-px mx-2 mb-4 sm:mb-5 transition-colors duration-200 ${isDone ? 'bg-primary-light dark:bg-primary-dark' : 'bg-border-light dark:bg-border-dark'}`}
                  aria-hidden="true"
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
