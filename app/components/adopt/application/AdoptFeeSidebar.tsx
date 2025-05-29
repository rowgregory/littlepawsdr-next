'use client'

import useCountdown, { Countdown } from '@hooks/useCountdown'
import ProgressTracker from './ProgressTracker'
import { RootState, useAppSelector } from '@redux/store'
import useCustomPathname from '@hooks/useCustomPathname'

const steps1Through3 = {
  one: 'Click next to accept Terms and Conditions',
  two: 'Fill out your personal information',
  three: 'The fee is $15 and helps support rescue efforts. Payments are processed securely through Stripe'
}

const step4 = (countdown: Countdown) => ({
  four: `Time remaining: ${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`
})

const AdoptFeeSidebar = () => {
  const path = useCustomPathname()
  const exp = useAppSelector((state: RootState) => state.feeExp.exp)
  const countdown = useCountdown(exp)

  let message
  switch (path) {
    case '/adopt/application/step1':
      message = steps1Through3.one
      break
    case '/adopt/application/step2':
      message = steps1Through3.two
      break
    case '/adopt/application/step3':
      message = steps1Through3.three
      break
    case '/adopt/application/step4':
      message = step4(countdown).four
      break
    default:
      message = ''
  }

  return (
    <aside className="bg-zinc-100 w-full 1200:w-96 1200:sticky 1200:top-0 1200:self-start 1200:overflow-y-auto h-[116.6px] 1200:h-auto 1200:min-h-dvh px-5 py-3 1200:py-6 z-20 flex flex-col juisty-center items-center 1200:items-start">
      <div className="bg-logo-purple bg-contain w-14 h-14 1200:w-20 1200:h-20 bg-center bg-no-repeat" />
      <h1 className="text-[22px] font-bold 1200:mt-3 text-[#222]">Adoption Appliation</h1>
      <h2 className="text-13 text-zinc-700 max-w-60">{message}</h2>
      <ProgressTracker />
    </aside>
  )
}

export default AdoptFeeSidebar
