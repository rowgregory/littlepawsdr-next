'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

const SPARK_OFFSETS = [...Array(8)].map(() => ({
  x: Math.random() * 40 - 20,
  y: Math.random() * 40 - 20
}))

const LightningTransition = ({ isActive, onComplete }: { isActive: boolean; onComplete: () => void }) => (
  <AnimatePresence>
    {isActive && (
      <motion.div
        className="fixed inset-0 z-9999 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onAnimationComplete={onComplete}
      >
        {/* Flash */}
        <motion.div
          className="absolute inset-0 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0.3, 0.9, 0] }}
          transition={{ duration: 0.6, times: [0, 0.1, 0.3, 0.5, 1], ease: 'easeInOut' }}
        />

        {/* Main bolt + branches */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1920 1080" fill="none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lightningGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e8f4ff" stopOpacity="0.9" />
              <stop offset="25%" stopColor="#c8e8ff" stopOpacity="1" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="75%" stopColor="#ddeeff" stopOpacity="1" />
              <stop offset="100%" stopColor="#b8d8ff" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          <motion.path
            d="M-100 200 L400 400 L200 450 L800 600 L600 650 L1200 800 L1000 850 L1600 950 L1400 1000 L2020 1200"
            stroke="url(#lightningGradient)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0], strokeWidth: [12, 20, 8, 4] }}
            transition={{ duration: 0.8, times: [0, 0.3, 0.7, 1], ease: 'easeInOut' }}
          />

          {[
            { d: 'M300 380 L250 320 L180 280', delay: 0.2 },
            { d: 'M700 580 L750 520 L820 480', delay: 0.3 },
            { d: 'M1100 780 L1150 720 L1220 680', delay: 0.4 }
          ].map(({ d, delay }, i) => (
            <motion.path
              key={i}
              d={d}
              stroke="url(#lightningGradient)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.8, 0.8, 0] }}
              transition={{ duration: 0.6, delay, ease: 'easeInOut' }}
            />
          ))}
        </svg>

        {/* Sparks */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{ left: `${20 + i * 15}%`, top: `${30 + Math.sin(i) * 20}%` }}
            initial={{ scale: 0, opacity: 0, rotate: 0 }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360],
              x: [0, SPARK_OFFSETS[i].x],
              y: [0, SPARK_OFFSETS[i].y]
            }}
            transition={{ duration: 0.8, delay: 0.1 + i * 0.05, ease: 'easeOut' }}
          />
        ))}

        {/* Energy rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border-4 border-white/80 rounded-full"
            style={{ left: '50%', top: '50%', width: 100, height: 100, marginLeft: -50, marginTop: -50 }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: [0, 3, 6], opacity: [0.8, 0.4, 0], rotate: [0, 180] }}
            transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
          />
        ))}

        {/* Sweep */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: [0, 1.5, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: 0.4, delay: 0.1, ease: 'easeInOut' }}
        />
      </motion.div>
    )}
  </AnimatePresence>
)

const useLightningTransition = () => {
  const [key, setKey] = useState(0)
  const [isActive, setIsActive] = useState(false)

  const triggerLightning = (callback?: () => void) => {
    setKey((k) => k + 1) // force remount so it replays every time
    setIsActive(true)
    setTimeout(() => {
      setIsActive(false)
      callback?.()
    }, 750)
  }

  const LightningComponent = () => <LightningTransition key={key} isActive={isActive} onComplete={() => setIsActive(false)} />

  return { triggerLightning, LightningComponent, isActive }
}

export { LightningTransition, useLightningTransition }
