'use client'

import useGetDachshundsByStatus from '@hooks/useGetDachshundsByStatus'
import useStagger from '@hooks/useStagger'
import { RootState, useAppSelector } from '@redux/store'
import Hero from 'app/components/common/Hero'
import DachshundCard from 'app/components/dachshunds/DachshundCard'
import React from 'react'

const DachshundsPage = () => {
  const dachshund = useAppSelector((state: RootState) => state.dachshund)
  const dachshunds = dachshund.dachshunds

  useGetDachshundsByStatus('Available', 50, 1)

  const staggeredStates = useStagger(dachshunds || [])

  return (
    <div className="mb-40">
      <Hero
        bgImg="/images/available.jpg"
        title="Available Dachshunds"
        breadcrumb="Available Dachshunds"
        className="bg-[length:130%] sm:bg-[0_23%] sm:bg-[length:100%] md:bg-[0_28%]"
      />
      <div className="max-w-[1150px] mx-auto w-full mt-20">
        <p className="text-teal-400 text-xl font-QBold mb-5 text-center">Meet The Animals</p>
        <p className="text-5xl text-color font-QBold mb-5 text-center">Waiting For Adoption</p>
        <p className="text-color font-QLight text-center mb-10">
          We are excited that you are interested in adding a dachshund <br /> or dachshund-mix to your family!
        </p>
        <div className="grid grid-cols-12 gap-10">
          {dachshunds?.map((obj, i) => (
            <DachshundCard key={i} obj={obj} animate={staggeredStates[i]?.isVisible} delay={staggeredStates[i]?.delay} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default DachshundsPage
