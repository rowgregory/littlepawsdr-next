import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import useRemoveScroll from '@hooks/useRemoveScroll'
import { setCloseDrawer } from '@redux/features/dashboardSlice'
import { useAppDispatch } from '@redux/store'
import useIsMobile from '@hooks/useIsMobile'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children }) => {
  const dragControls = useDragControls()
  const dispatch = useAppDispatch()
  useRemoveScroll(true)
  const isMobile = useIsMobile()

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '20%', z: 1 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 10, stiffness: 50 }}
            onClick={(e) => e.stopPropagation()}
            className="shadow-dark w-full h-full bg-white dark:bg-deepslate p-6 rounded-tl-2xl rounded-tr-2xl absolute bottom-0"
            drag={isMobile ? 'y' : false}
            dragConstraints={{ top: 200, bottom: 0 }}
            dragElastic={0.9}
            dragMomentum={true}
            dragControls={dragControls}
            onDragEnd={(event, info) => onClose()}
          >
            <motion.div
              onClick={() => dispatch(setCloseDrawer())}
              className="w-12 h-1 bg-zinc-400 dark:bg-gray-500 rounded-full mx-auto mb-4 cursor-pointer"
              onPointerDown={(e) => dragControls.start(e)}
            />
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Drawer
