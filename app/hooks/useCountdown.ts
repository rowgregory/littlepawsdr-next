'use client'

import { useEffect, useState } from 'react'

export type Countdown = {
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

const initialCountdownState = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  milliseconds: 0
}

const useCountdown = (exp: number | null): Countdown => {
  const [remaining, setRemaining] = useState<Countdown>(initialCountdownState)

  useEffect(() => {
    if (!exp) return

    const update = () => {
      const now = Date.now()
      const distance = exp * 1000 - now

      if (distance <= 0) {
        setRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          milliseconds: 0
        })
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((distance / (1000 * 60)) % 60)
      const seconds = Math.floor((distance / 1000) % 60)
      const milliseconds = Math.floor(distance % 1000)

      setRemaining({ days, hours, minutes, seconds, milliseconds })
    }

    update()
    const interval = setInterval(update, 100)
    return () => clearInterval(interval)
  }, [exp])

  return remaining
}

export default useCountdown
