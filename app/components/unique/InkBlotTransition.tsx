'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const InkBlotTransition = ({ isActive }: { isActive: boolean }) => (
  <AnimatePresence>
    {isActive && (
      <motion.div
        className="fixed inset-0 z-9999 pointer-events-none flex items-center justify-center"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <motion.div
          className="absolute bg-bg-dark dark:bg-bg-light rounded-full"
          style={{ width: 100, height: 100 }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 30, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        />
      </motion.div>
    )}
  </AnimatePresence>
)

const useInkBlotTransition = () => {
  const [key, setKey] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const router = useRouter()

  const navigate = (href: string) => {
    setKey((k) => k + 1)
    setIsActive(true)
    setTimeout(() => {
      router.push(href)
      setTimeout(() => setIsActive(false), 400)
    }, 500)
  }

  const InkBlotComponent = () => <InkBlotTransition key={key} isActive={isActive} />

  return { navigate, InkBlotComponent }
}

export { InkBlotTransition, useInkBlotTransition }
