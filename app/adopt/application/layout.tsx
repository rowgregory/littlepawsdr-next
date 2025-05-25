'use client'

import React, { FC } from 'react'
import { ChildrenProps } from 'app/types/general-types'
import AdoptFeeSidebar from 'app/components/adopt/application/AdoptFeeSidebar'

const AdoptFeeAppLayout: FC<ChildrenProps> = ({ children }) => {
  return (
    <div className="flex flex-col 1200:flex-row min-h-dvh max-h-dvh overflow-hidden">
      <AdoptFeeSidebar />
      <main className="flex-1 px-4  760:px-28 py-[123px] w-full max-w-screen-xl mx-auto">{children}</main>
    </div>
  )
}

export default AdoptFeeAppLayout
