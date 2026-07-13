type ISwitchProps = {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function Switch({ checked, onChange }: ISwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
    >
      <div
        aria-hidden="true"
        className={`relative w-10 h-5 transition-colors duration-200 ${checked ? 'bg-primary-light dark:bg-primary-dark' : 'bg-border-light dark:bg-border-dark'}`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 bg-white transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
        />
      </div>
    </button>
  )
}
