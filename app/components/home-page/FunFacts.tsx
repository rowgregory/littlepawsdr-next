import React from 'react'
import Picture from '../common/Picture'

const FunFacts = () => {
  return (
    <div className="mb-60 relative h-[750px] bg-[#f2f2ee]">
      <div className="contact-bg"></div>
      <div className="max-w-[1150px] w-full mx-auto grid grid-cols-12 pt-24">
        <div className="col-span-12 lg:col-span-6 mr-16">
          <Picture src="/images/fun-facts.jpg" className="w-full rounded-2xl h-[750px] object-cover" priority={false} />
        </div>
        <div className="col-span-12 lg:col-span-6 relative">
          <p className="text-teal-400 text-xl font-quicksand font-semibold mb-5 pt-5">Fun Fact Must You Know</p>
          <h1 className="text-5xl text-[#414141] mb-5">
            You Hold the Key <br /> to Transform Tomorrow.
          </h1>
          <p className="text-[#414141] mb-6 font-thin">
            Every small action can create a ripple effect of change. By choosing to adopt, volunteer, or support organizations dedicated to
            animal welfare, you can transform the lives of countless dogs in need
          </p>
          <div className="bg-teal-400 p-6 rounded-2xl text-white w-96 absolute bottom-10 -left-60">
            <p className="font-light mb-5">“Until one has loved an animal a part of one’s soul remains unawakened.”</p>
            <p className="font-bold">Anatole France</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FunFacts
