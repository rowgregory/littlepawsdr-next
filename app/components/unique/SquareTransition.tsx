'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

const COLS = 32
const ROWS = 24

const SquaresTransition = ({ isActive }: { isActive: boolean }) => (
  <AnimatePresence>
    {isActive && (
      <motion.div
        className="fixed inset-0 z-9999 pointer-events-none grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
        exit={{ opacity: 0 }}
        transition={{ duration: 10, delay: 0.4 }}
      >
        {[...Array(ROWS * COLS)].map((_, i) => {
          const col = i % COLS
          const row = Math.floor(i / COLS)
          const delay = (col + row) * 0.04

          return (
            <motion.div
              key={i}
              className="dark:bg-primary-dark bg-primary-light"
              initial={{ scaleY: 0, originY: 1 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0, originY: 0 }}
              transition={{
                duration: 10,
                delay,
                ease: [0.76, 0, 0.24, 1]
              }}
            />
          )
        })}
      </motion.div>
    )}
  </AnimatePresence>
)

const useSquaresTransition = () => {
  const [key, setKey] = useState(0)
  const [isActive, setIsActive] = useState(false)

  const navigate = () => {
    setKey((k) => k + 1)
    setIsActive(true)
  }

  const SquaresComponent = () => <SquaresTransition key={key} isActive={isActive} />

  return { navigate, SquaresComponent }
}

export { SquaresTransition, useSquaresTransition }
