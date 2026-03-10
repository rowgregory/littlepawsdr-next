import { setOpenNavigationDrawer } from 'app/lib/store/slices/uiSlice'
import { store, useUiSelector } from 'app/lib/store/store'
import { motion } from 'framer-motion'

const RainbowBurgerMenu = () => {
  const { navigationDrawer } = useUiSelector()
  return (
    <motion.button
      onClick={() => store.dispatch(setOpenNavigationDrawer())}
      className="relative w-10 h-9 flex flex-col justify-between cursor-pointer p-1"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* Top Bar - Animated Rainbow */}
      <motion.div
        className="w-full h-1.5 rounded-full shadow-sm"
        style={{
          background: 'linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6, #ef4444)',
          backgroundSize: '200% 100%'
        }}
        animate={{
          rotate: navigationDrawer ? 45 : 0,
          y: navigationDrawer ? 8 : 0,
          scaleX: navigationDrawer ? 1.1 : 1,
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          rotate: { duration: 0.3, ease: 'easeInOut' },
          y: { duration: 0.3, ease: 'easeInOut' },
          scaleX: { duration: 0.3, ease: 'easeInOut' },
          backgroundPosition: { duration: 3, repeat: Infinity, ease: 'linear' }
        }}
      />

      {/* Middle Bar - Animated Rainbow */}
      <motion.div
        className="w-full h-1.5 rounded-full shadow-sm"
        style={{
          background: 'linear-gradient(90deg, #8b5cf6, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6)',
          backgroundSize: '200% 100%'
        }}
        animate={{
          opacity: navigationDrawer ? 0 : 1,
          scaleX: navigationDrawer ? 0 : 1,
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          opacity: { duration: 0.2 },
          scaleX: { duration: 0.2 },
          backgroundPosition: { duration: 2.5, repeat: Infinity, ease: 'linear', delay: 0.5 }
        }}
      />

      {/* Bottom Bar - Animated Rainbow */}
      <motion.div
        className="w-full h-1.5 rounded-full shadow-sm"
        style={{
          background: 'linear-gradient(90deg, #22c55e, #3b82f6, #8b5cf6, #ef4444, #f97316, #eab308, #22c55e)',
          backgroundSize: '200% 100%'
        }}
        animate={{
          rotate: navigationDrawer ? -45 : 0,
          y: navigationDrawer ? -8 : 0,
          scaleX: navigationDrawer ? 1.1 : 1,
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          rotate: { duration: 0.3, ease: 'easeInOut' },
          y: { duration: 0.3, ease: 'easeInOut' },
          scaleX: { duration: 0.3, ease: 'easeInOut' },
          backgroundPosition: { duration: 2.8, repeat: Infinity, ease: 'linear', delay: 1 }
        }}
      />

      {/* Animated Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0 blur-sm -z-10"
        style={{
          background: 'linear-gradient(45deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6, #ef4444)',
          backgroundSize: '400% 400%'
        }}
        whileHover={{ opacity: 0.4 }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          opacity: { duration: 0.3 },
          backgroundPosition: { duration: 4, repeat: Infinity, ease: 'linear' }
        }}
      />
    </motion.button>
  )
}

export default RainbowBurgerMenu
