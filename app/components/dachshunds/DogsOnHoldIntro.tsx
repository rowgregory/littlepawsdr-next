import React from 'react'
import Icon from '../common/Icon'
import { playIcon } from 'app/lib/font-awesome/icons'
import Picture from '../common/Picture'

const DogsOnHoldIntro = () => {
  return (
    <div className="flex items-center justify-between w-full mb-24">
      <div className="relative">
        <div className="pulse-button border-4 border-white absolute -top-4 -left-4 w-12 h-12 rounded-full flex justify-center items-center bg-teal-400 cursor-pointer hover:bg-teal-500 duration-200">
          <Icon icon={playIcon} className="text-white" />
        </div>
        <Picture src="/images/hold-2.jpg" className="w-52 rounded-2xl" priority={false} />
      </div>
      <div className="flex items-center justify-center flex-col">
        <p className="text-teal-400 text-xl font-QBold mb-4">Dogs on Hold for Adoption</p>
        <h1 className="text-4xl text-center text-color font-QBold">
          Preparing for <br /> Their Forever Homes
        </h1>
      </div>
      <div className="relative">
        <Picture src="/images/hold-3.jpg" className="w-40 object-cover aspect-square rounded-2xl mr-16" priority={false} />
        <div className="bg-white w-36 flex items-center justify-center aspect-square rounded-2xl p-1.5 absolute z-10 -right-10 bottom-2">
          <Picture src="/images/hold-4.jpg" className="w-full object-cover aspect-square rounded-2xl " priority={false} />
        </div>
      </div>
    </div>
  )
}

export default DogsOnHoldIntro
