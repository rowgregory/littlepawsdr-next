import React from 'react'
import Logo from '../Logo'
import Picture from '../common/Picture'

const FooterCredits = () => {
  return (
    <div className="bg-[#1C1E299E] text-white pt-5 pb-2 px-3 xl:px-0">
      <div className="max-w-[1150px] mx-auto w-full flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center flex-col sm:flex-row">
          <Logo className="w-32 sm:-ml-3.5" />
          <button onClick={() => window.open('https://sqysh.io', '_blank')} className="flex items-center mt-5 sm:mt-0">
            <p className="mt-2 sm:ml-12 mr-1 font-QLight text-sm">Developed by</p>
            <Picture src="/images/sqysh.png" className="w-[52px]" priority={false} />
          </button>
        </div>
        <p className="font-QLight text-xs mt-3 sm:mt-0 text-center sm:text-start">
          Copyright&copy; {new Date().getFullYear()}. All Rights Reserved
        </p>
      </div>
    </div>
  )
}

export default FooterCredits
