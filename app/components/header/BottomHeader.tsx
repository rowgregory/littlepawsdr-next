import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toggleNavigationDrawer } from '@redux/features/navbarSlice'
import { useAppDispatch } from '@redux/store'
import { barsIcon } from 'app/lib/font-awesome/icons'
import Link from 'next/link'
import React from 'react'

const BottomHeader = () => {
  const dispatch = useAppDispatch()
  return (
    <div className="max-w-[1150px] mx-auto w-full bg-white rounded-2xl mt-6 shadow-lg z-10">
      <div className="h-24 flex items-center justify-between px-6 sm:px-10">
        <FontAwesomeIcon
          icon={barsIcon}
          className="text-teal-400 fa-xl"
          onClick={() => {
            dispatch(toggleNavigationDrawer({ navigationDrawer: true }))
          }}
          data-testid="burger-button"
        />
        <div className="flex-items-center"></div>
        <Link className="bg-teal-400 text-white py-4 px-9 rounded-lg font-QBold uppercase" href="/donate">
          Donate Now
        </Link>
      </div>
    </div>
  )
}

export default BottomHeader
