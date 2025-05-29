import React from 'react'
import Icon from '../common/Icon'
import { fbIcon, instaIcon } from 'app/lib/font-awesome/icons'

const FooterAboutSection = () => {
  return (
    <div className="col-span-12 lg:col-span-3 text-white">
      <h4 className="text-2xl mb-5 font-QBold">About</h4>
      <p className="font-QLight text-sm text-white leading-6">
        LITTLE PAWS DACHSHUND RESCUE is an east coast based 501(c)3 exempt nonprofit dedicated to the rescue and re-homing of our favorite short
        legged breed
      </p>
      <div className="border border-[#898b97] opacity-20 my-8"></div>
      <h5 className="text-xl mb-5">Social Media</h5>
      <div className="flex items-center gap-3">
        <div className="bg-teal-400 flex items-center justify-center w-12 h-12 aspect-square rounded-lg">
          <Icon icon={fbIcon} className="fa-lg" />
        </div>
        <div className="bg-teal-400 flex items-center justify-center w-12 h-12 aspect-square rounded-lg">
          <Icon icon={instaIcon} className="fa-lg" />
        </div>
      </div>
    </div>
  )
}

export default FooterAboutSection
