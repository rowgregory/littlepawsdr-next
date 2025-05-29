'use client'

import { useGetDogBoostsQuery } from '@redux/services/dogBoostApi'
import { RootState, useAppSelector } from '@redux/store'
import Link from 'next/link'
import React from 'react'
import DogBoostCard from './DogBoostCard'

const SafeAndEasyDonations = () => {
  const { dogBoosts } = useAppSelector((state: RootState) => state.DogBoost)
  useGetDogBoostsQuery()

  return (
    <div className="max-w-[1150px] w-full mx-auto mb-40">
      <p className="text-teal-400 text-xl font-semibold mb-5">Safe & Easy Donations</p>
      <div className="flex items-center justify-between mb-10">
        <p className="text-5xl text-color mb-5">Help Atleast Just One Animal</p>
        <Link href="/dachshunds" className="bg-teal-400 text-white py-4 px-9 rounded-lg w-fit">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-12 gap-10">
        {dogBoosts?.map((obj: any, i: number) => (
          <DogBoostCard key={i} obj={obj} />
        ))}
      </div>
    </div>
  )
}

export default SafeAndEasyDonations
