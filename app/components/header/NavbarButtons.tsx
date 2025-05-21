import { faDonate, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { RootState, useAppDispatch, useAppSelector } from '@redux/store'
import Link from 'next/link'
import React from 'react'
import { toggleUserDropdown } from '@redux/features/navbarSlice'
import { User } from 'app/types/model.types'

const styles = `bg-gray-300 text-slate-800 h-10 w-10 rounded-full flex justify-center items-center cursor-pointer duration-300 hover:bg-gray-400 hover:no-underline`

const Donate = () => (
  <Link href="/donate" className={styles}>
    <FontAwesomeIcon icon={faDonate} color="#333" />
  </Link>
)

const Cart = () => {
  const cart = useAppSelector((state: RootState) => state.cart)

  return (
    <Link href="/cart" className={`${styles} relative`}>
      <span className="text-white text-xs absolute -top-1 left-6 flex items-center text-center justify-center z-10 cursor-pointer bg-red-500 font-Matter-Medium w-5 h-5 rounded-full">
        {cart?.cartItemsAmount}
      </span>
      <FontAwesomeIcon icon={faShoppingCart} color="#333" />
    </Link>
  )
}

const Auth = () => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state: RootState) => state.auth)
  const user: User = auth?.user

  return user?.isAdmin ? (
    <>Admin</>
  ) : user?._id ? (
    <div
      className={`uppercase cursor-pointer h-10 w-10 rounded-full flex items-center justify-center`}
      onClick={() => dispatch(toggleUserDropdown({ userDropdown: true }))}
    >
      {user?.firstNameFirstInitial}
      {user?.lastNameFirstInitial}
    </div>
  ) : (
    <Link href="/auth/login" className={styles}>
      <FontAwesomeIcon icon={faUser} color="#333" />
    </Link>
  )
}

export { Donate, Cart, Auth }
