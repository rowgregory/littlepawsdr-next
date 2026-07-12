export function EmptyState({ message }: { message: string }) {
  return (
    <div className="border border-dashed border-border-light dark:border-border-dark py-10 text-center">
      <p className="text-xs font-mono text-muted-light dark:text-muted-dark">{message}</p>
    </div>
  )
}
