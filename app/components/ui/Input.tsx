export function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  disabled
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark mb-2"
      >
        {label}
        {required && (
          <span className="text-secondary-light dark:text-secondary-dark ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        disabled={disabled}
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={type === 'email' ? 'email' : type === 'tel' ? 'tel' : undefined}
        className={`${type === 'email' ? 'bg-surface-light' : 'bg-white'} w-full px-4 py-3 dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition disabled:cursor-not-allowed`}
      />
      {type === 'email' && disabled && (
        <p className="mt-1.5 text-xs text-muted-light dark:text-muted-dark">
          This is the email associated with your account and cannot be changed here.
        </p>
      )}
    </div>
  )
}
