import { useEffect, useState } from 'react'
import Spinner from './Spinner'

const CountdownTimer = ({ startDate }: any) => {
  const [timeRemaining, setTimeRemaining] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const targetDate: any = new Date(startDate)

    const interval = setInterval(() => {
      const now: any = new Date()
      const difference = targetDate - now

      if (difference <= 0) {
        clearInterval(interval)
        setTimeRemaining('Event has passed.')
        setLoading(false)
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`)
        setLoading(false)
      }
    }, 1000)

    // Cleanup interval on component unmount
    return () => clearInterval(interval)
  }, [startDate])

  return <div className="animate-fade-in">{loading ? <Spinner fill="fill-azure dark:fill-amathystglow" /> : timeRemaining}</div>
}

export default CountdownTimer
