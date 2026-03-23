import { useFormSelector } from 'app/lib/store/store'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

type Props = {
  formName: string
  isValid: boolean
  label: string
}

export function SubmitButton({ formName, isValid, label }: Props) {
  const form = useFormSelector()
  const inputs = form?.[formName]?.inputs
  const loading = !!inputs?.loading
  const ready = isValid && !loading

  return (
    <motion.button
      type="submit"
      disabled={!ready}
      whileHover={ready ? { scale: 1.02 } : {}}
      whileTap={ready ? { scale: 0.98 } : {}}
      aria-disabled={!ready}
      className={`w-full py-4 font-black text-[11px] tracking-[0.2em] uppercase font-mono transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark flex items-center justify-center gap-2
        ${
          ready
            ? 'bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white cursor-pointer'
            : 'bg-surface-light dark:bg-surface-dark text-muted-light dark:text-muted-dark border-2 border-border-light dark:border-border-dark cursor-not-allowed'
        }`}
    >
      {loading ? (
        <span className="flex items-center gap-2" aria-live="polite">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="block w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full"
            aria-hidden="true"
          />
          Processing...
        </span>
      ) : (
        <>
          {label}
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </>
      )}
    </motion.button>
  )
}
