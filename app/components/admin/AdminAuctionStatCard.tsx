import { motion } from 'framer-motion'

export function AdminAuctionStatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconColor,
  iconBg,
  delay = 0
}: {
  label: string
  value: string
  sub?: string
  icon: React.ElementType
  iconColor: string
  iconBg: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark p-5"
    >
      <div className={`w-8 h-8 flex items-center justify-center mb-3 ${iconBg}`}>
        <Icon size={14} className={iconColor} aria-hidden="true" />
      </div>
      <p className="text-xl font-black font-quicksand text-text-light dark:text-text-dark leading-none mb-1">{value}</p>
      <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">{label}</p>
      {sub && <p className="text-[10px] font-mono text-muted-light/60 dark:text-muted-dark/60 mt-0.5">{sub}</p>}
    </motion.div>
  )
}
