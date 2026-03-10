'use client'

import { motion } from 'framer-motion'

export const LPDRLogo = () => {
  return (
    <header className="bg-bg-light dark:bg-bg-dark" aria-label="Little Paws Dachshund Rescue">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-180 1000:max-w-240 1200:max-w-300 mx-auto w-full py-35.5 flex flex-col justify-center"
      >
        <div className="inline-flex flex-col mx-auto">
          {/* Row 1 — Little Paws */}
          <div className="flex items-baseline" aria-hidden="true">
            <span className="font-quicksand font-light text-[clamp(2.5rem,10vw,9rem)] tracking-tight text-primary-light dark:text-primary-dark">
              Little&nbsp;
            </span>
            <span className="font-quicksand font-black text-[clamp(2.75rem,13vw,13rem)] tracking-tight text-primary-light dark:text-primary-dark">
              Paws
            </span>
          </div>

          {/* Row 2 — right-aligned to Paws */}
          <div className="flex justify-end -mt-20" aria-hidden="true">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-nunito font-normal text-[clamp(0.75rem,3vw,3.125rem)] text-muted-light dark:text-muted-dark whitespace-nowrap"
            >
              Dachshund Rescue
            </motion.span>
          </div>
        </div>
      </motion.div>
    </header>
  )
}
