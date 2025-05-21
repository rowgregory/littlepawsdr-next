import React from 'react'
import AboutDataPoint from './AboutDataPoint'
import { boneIcon, homeIcon, medkitIcon } from 'app/icons'
import Picture from '../common/Picture'
import Icon from '../common/Icon'
import { aboutData } from '@public/static-data/home-page-data'

const About = () => {
  return (
    <div className="mx-auto max-w-[1150px] w-full mb-40 grid grid-cols-12">
      <div className="col-span-12 lg:col-span-7 lg:mr-20">
        <h3 className="text-teal-400 text-xl font-semibold mb-5">About Little Paws Dachshund Rescue</h3>
        <h1 className="text-5xl  text-color font-bold mb-5">We&apos;re The World&apos;s Most Trusted Animal Rescue</h1>
        <p className="text-color font-light opacity-70 text-15 leading-6 tracking-wider mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
          enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in
          reprehenderit.
        </p>
        <div className="grid grid-cols-12 gap-3 mb-10">
          {aboutData.map((text, i) => (
            <AboutDataPoint key={i} text={text} />
          ))}
        </div>
        <div className="px-8 py-5 flex items-center gap-6 shadow-lg w-fit rounded-xl">
          <Icon icon={medkitIcon} className="text-teal-400 w-12 h-12" />
          <div className="flex flex-col">
            <h1 className="text-4xl ">
              1,500 <span className="text-teal-400 w-10 h-10">+</span>
            </h1>
            <p className=" text-zinc-600">Successful rescues</p>
          </div>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-5 relative">
        <Picture src="/images/about.jpg" className="w-full rounded-xl max-h-[650px] object-cover" priority={false} />
        <div className="p-6 bg-white rounded-xl absolute top-12 -left-12 w-36 h-40 flex flex-col justify-center items-center shadow-lg">
          <Icon icon={boneIcon} className="text-teal-400 w-10 h-10 mb-2" />
          <p className="text-color text-center">Animation Abandoned</p>
        </div>
        <div className="p-6 bg-white rounded-xl absolute bottom-24 right-6 w-36 h-40 flex flex-col justify-center items-center shadow-xl">
          <Icon icon={homeIcon} className="text-teal-400 w-10 h-10 mb-2" />
          <p className="text-color text-center">Animal House</p>
        </div>
      </div>
    </div>
  )
}

export default About
