'use client'

import React from 'react'
import Spinner from './Spinner'
import useVideo from '@hooks/useVideo'

const Banner = ({ src, text1, text2, text3 }: any) => {
  const { loading, videoRef } = useVideo()

  return (
    <div className="relative w-full min-h-screen">
      <div className={`${!loading ? 'fade-out' : ''} spinner absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}>
        <Spinner fill="fill-slate-900" wAndH="w-10 h-10" />
      </div>
      <video
        ref={videoRef}
        className="fade-in block w-full h-full object-cover absolute top-0 left-0 z-0"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center flex-col w-full h-full flex items-center justify-center bg-[#1c1c1c]/60">
        <div className="max-w-screen-lg">
          <p className="slide-down text-white text-xl tracking-wider mb-5 px-8 lg:px-16">{text1}</p>
          <h1 className="text-center mb-10 scale-in text-5xl xl:text-6xl text-white font-bold uppercase">{text2}</h1>
          <p className="slide-up text-white text-2xl lg:text-3xl font-bold tracking-wider mb-16 px-8 lg:px-16">{text3}</p>
        </div>
      </div>
    </div>
  )
}

export default Banner
