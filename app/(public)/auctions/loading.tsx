'use client'

import { motion } from 'framer-motion'

const Loading = () => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-bg-dark"
      role="status"
      aria-label="Loading"
      aria-live="polite"
    >
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex items-center gap-3 mb-8"
        aria-hidden="true"
      >
        <div className="w-4 h-px bg-cyan-600 dark:bg-violet-400" />
        <span className="font-changa text-[10px] uppercase tracking-[0.25em] text-cyan-600 dark:text-violet-400">Little Paws Dachshund Rescue</span>
        <div className="w-4 h-px bg-cyan-600 dark:bg-violet-400" />
      </motion.div>

      {/* Animated bars */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="flex items-end gap-1.5 h-10 mb-8"
        aria-hidden="true"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="w-1 bg-cyan-600 dark:bg-violet-400 origin-bottom"
            animate={{ scaleY: [0.2, 1, 0.2] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.12
            }}
            style={{ height: '100%' }}
          />
        ))}
      </motion.div>

      {/* Label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="font-changa text-[10px] uppercase tracking-[0.25em] text-zinc-400 dark:text-muted-dark"
      >
        Loading
      </motion.p>

      <span className="sr-only">Loading, please wait</span>
    </div>
  )
}

export default Loading
