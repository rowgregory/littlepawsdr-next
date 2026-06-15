export function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-[10px] font-mono text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
      <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">{children}</p>
    </div>
  )
}
