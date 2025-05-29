import { userInfo } from '@public/static-data/fakeUserObj'
import { useEffect, useState } from 'react'

const useUserName = () => {
  const [initials, setInitials] = useState('')

  useEffect(() => {
    const first = userInfo?.name?.[0]?.trim() ?? ''
    const last = (userInfo?.name?.split(' ')[1]?.[0]?.toUpperCase() ?? '').trim()
    const initials = `${first} ${last}`

    setInitials(initials)
  }, [])

  return { initials }
}

export default useUserName
