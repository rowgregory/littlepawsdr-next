import React from 'react'
import Picture from '../common/Picture'
import Link from 'next/link'

const DogBoostCard = ({ obj }: { obj: any }) => {
  return (
    <div className="col-span-12 lg:col-span-4 p-6 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)] w-full flex flex-col rounded-xl">
      <Picture src={obj.displayUrl} className="w-full object-cover rounded-xl h-64" priority={false} />
      <Link href={`/dog-boost/${obj._id}`} className="-m-8 bg-teal-400 text-white py-4 px-9 rounded-2xl font-quicksand w-fit self-center">
        Donate Now
      </Link>
      <div className="flex flex-col mt-16">
        <h2 className="text-color text-2xl mb-5 truncate">{obj.name}</h2>
        <p className="text-color font-light">{obj.bio}</p>
        <hr className="border-2 border-teal-400 w-full mt-12 mb-6" />
        <div className="flex items-center">
          <p className="text-color font-light">
            Raised: <span className="text-teal-400 font-bold tracking-wide">$990.00</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default DogBoostCard
