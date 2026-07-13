import { ReactNode } from 'react'

type Props = {
  heading: string
  action?: ReactNode
  children: ReactNode
}

export function SectionShell({ heading, action, children }: Props) {
  return (
    <section className="border border-border-light dark:border-border-dark">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark">
        <div className="flex items-center gap-3">
          <span className="block w-5 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
          <h2 className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
            {heading}
          </h2>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-bg-dark">{children}</div>
    </section>
  )
}
