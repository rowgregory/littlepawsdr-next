'use client'

import { RootState, useAppSelector } from '@redux/store'
import React from 'react'

const Step4 = () => {
  const { exp } = useAppSelector((state: RootState) => state.feeExp)

  const formattedExp = exp
    ? new Date(exp * 1000).toLocaleString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : null

  return (
    <div className="max-w-[589px] mx-auto 1200:mx-0 h-full">
      <h1 className="font-lg font-semibold text-center 1200:text-left">Available until {formattedExp}</h1>
      <h2 className="text-12 mb-4 text-center 1200:text-left">
        You can leave this page and come back any time before the deadline shown above. Just keep in mind—any progress inside this form
        won&apos;t be saved if you leave.
      </h2>
      <div className="h-[500px] overflow-y-auto p-6 flex flex-col items-center rounded-lg border-1 border-zinc-200">
        <iframe
          className="h-[500px] overflow-y-scroll"
          title="Adoption Application"
          width="100%"
          src="https://toolkit.rescuegroups.org/of/f?c=WHMQCBRV"
        ></iframe>
      </div>
      <h3 className="text-12 text-center 1200:text-right">Powered by RescueGroups.org</h3>
    </div>
  )
}

export default Step4
