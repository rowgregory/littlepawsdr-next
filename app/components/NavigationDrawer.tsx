import { FC } from 'react'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import useOutsideDetect from '@hooks/useOutsideDetect'
import LinkContent from './navigation-drawer/LinkContent'
import { RootState, useAppDispatch, useAppSelector } from '@redux/store'
import { toggleNavigationDrawer } from '@redux/features/navbarSlice'
import AwesomeIcon from './common/AwesomeIcon'

const NavigationDrawer: FC = () => {
  const dispatch = useAppDispatch()
  const navbar = useAppSelector((state: RootState) => state.navbar)
  const closeDropDown = () => {
    dispatch(toggleNavigationDrawer({ navigationDrawer: false }))
  }
  const overlayRef = useOutsideDetect(closeDropDown)

  return (
    <aside
      ref={overlayRef}
      className={`${
        navbar.toggle.navigationDrawer ? 'left-0 w-screen md:w-[400px]' : '-left-screen w-0 md:left-[-400px]'
      } min-h-screen h-screen overflow-y-scroll fixed z-[6000] top-0 bg-[#33495e] duration-300`}
    >
      <AwesomeIcon icon={faChevronLeft} onClick={() => closeDropDown()} className="absolute top-5 right-2.5 cursor-pointer" />
      <LinkContent closeMenu={closeDropDown} />
    </aside>
  )
}

export default NavigationDrawer
