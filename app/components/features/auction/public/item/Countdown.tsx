import { CountUnit } from 'app/components/_primitives'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

export function Countdown({ headerInView, days, hours, minutes, seconds }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={headerInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="border border-border-light dark:border-border-dark p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock size={11} className="text-muted-light dark:text-muted-dark" aria-hidden="true" />
        <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
          Auction Closes In
        </span>
      </div>
      <div
        className="flex items-end gap-5"
        aria-label={`${days} days ${hours} hours ${minutes} minutes ${seconds} seconds remaining`}
        aria-live="polite"
        aria-atomic="true"
      >
        {days > 0 && <CountUnit value={days} label="days" size="lg" />}
        <CountUnit value={hours} label="hrs" size="lg" />
        <CountUnit value={minutes} label="min" size="lg" />
        <CountUnit value={seconds} label="sec" size="lg" />
      </div>
    </motion.div>
  )
}
