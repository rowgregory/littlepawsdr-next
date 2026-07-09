'use client'

import { motion } from 'framer-motion'

export const LPDRLogo = () => {
  return (
    <div className="bg-bg-light dark:bg-bg-dark" aria-label="Little Paws Dachshund Rescue">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-180 1000:max-w-240 1200:max-w-300 mx-auto w-full px-4 xs:px-5 sm:px-6 py-10 sm:py-20 1200:py-35.5 flex flex-col justify-center"
      >
        <div className="inline-flex flex-col mx-auto">
          {/* Row 1 — Little Paws */}
          <div className="flex items-baseline" aria-hidden="true">
            <span className="font-quicksand font-light text-[3.75rem] 968:text-[12rem] tracking-tight text-primary-light dark:text-primary-dark">
              Little
            </span>
            <span className="font-quicksand font-black text-[6rem] 968:text-[20rem] tracking-tighter text-primary-light dark:text-primary-dark">
              Paws
            </span>
          </div>

          {/* Row 2 — right-aligned to Paws */}
          <div className="flex justify-end" aria-hidden="true">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-nunito font-bold 968:font-normal text-[1rem] 968:text-[4rem] -mt-7 968:-mt-32 text-muted-light dark:text-muted-dark whitespace-nowrap"
            >
              Dachshund Rescue
            </motion.span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
