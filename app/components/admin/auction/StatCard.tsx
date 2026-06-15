import { useInView, motion } from 'framer-motion'
import { useRef } from 'react'

export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
  delay = 0
}: {
  label: string
  value: string
  icon: React.ElementType
  iconColor: string
  delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.35, delay }}
      className="bg-bg-light dark:bg-bg-dark px-3 py-2.5"
    >
      <p className="flex items-center gap-1.5 text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
        <Icon size={10} className={iconColor} aria-hidden="true" />
        {label}
      </p>
      <p className="mt-1 text-base font-black font-mono tabular-nums text-text-light dark:text-text-dark leading-none">{value}</p>
    </motion.div>
  )
}
