'use client'

import React, { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAppDispatch } from '@redux/store'
import { useLogoutMutation } from '@redux/services/authApi'
import { setAuthState } from '@redux/features/authSlice'
import AwesomeIcon from '../common/AwesomeIcon'
import { pawIcon, signOutAltIcon } from 'app/icons'
import useCustomPathname from '@hooks/useCustomPathname'
import { adminNavigationLinkData } from '@public/static-data/navigation-link.data'

const AdminHeader = () => {
  const dispatch = useAppDispatch()
  const [logout, { isLoading, error }] = useLogoutMutation()
  const { push } = useRouter()
  const path = useCustomPathname()
  const items = adminNavigationLinkData(path)

  const handleLogout = async (e: FormEvent) => {
    e.preventDefault()
    await logout().unwrap()
    dispatch(setAuthState({}))
    push('/auth/login')
  }

  return (
    <header className="sticky top-0 z-50 max-w-[2000px] px-14 mx-auto h-12 flex items-center justify-between">
      <AwesomeIcon icon={pawIcon} className="w-5 h-5 text-jet dark:text-amathystglow" />
      <div className="hidden 860:flex items-center gap-x-7 absolute left-1/2 -translate-x-1/2 transform">
        {items?.map((link: any, i: number) => (
          <Link
            key={i}
            href={link.linkKey}
            className={`whitespace-nowrap text-xs ${link.active ? 'text-black dark:text-amathystglow' : 'text-ash dark:text-zinc-200'}`}
          >
            {link.textKey}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-x-4">
        {error?.data?.message && <div className="text-13 text-red-500">{error?.data?.message}</div>}
        <button disabled={isLoading} onClick={handleLogout}>
          {isLoading ? <></> : <AwesomeIcon icon={signOutAltIcon} className="text-jet dark:text-amathystglow w-4 h-4" />}
        </button>
      </div>
    </header>
  )
}

export default AdminHeader
