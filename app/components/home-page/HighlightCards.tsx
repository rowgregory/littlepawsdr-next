import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Picture from '../common/Picture'
import { hightlightCardData } from '@public/static-data/home-page-data'

const HighlightCards = () => {
  return (
    <div className="w-full max-w-[1150px] mx-auto -mt-16 mb-44">
      <div className="grid grid-cols-12">
        {hightlightCardData.map((obj, i) => (
          <div
            key={i}
            className={`${
              i === 0 ? 'rounded-tl-2xl rounded-bl-2xl' : i === 2 ? 'rounded-tr-2xl rounded-br-2xl' : ''
            } col-span-12 md:col-span-6 xl:col-span-3 shadow-lg gap-3 flex flex-col justify-between items-start p-8 bg-white z-20 aspect-video xl:aspect-square`}
          >
            <FontAwesomeIcon icon={obj.icon} className="text-teal-400 w-8  h-8" />
            <h1 className="font-quicksand text-2xl text-[#454847]">{obj.titleKey}</h1>
            <p className="font-light text-[#a4a4a4]">{obj.textKey}</p>
            <p className="text-teal-400">Read More</p>
          </div>
        ))}
        <div className="xl:rounded-2xl col-span-12 md:col-span-6 xl:col-span-3 shadow-lg gap-2.5 flex flex-col justify-between items-start p-8 bg-teal-400 z-20 xl:ml-3 relative">
          <h1 className="font-quicksand text-2xl text-white">Explore More</h1>
          <p className="font-light text-white">
            Lorem ipsum dolor sit amet, consectetur adipi scing elit. Ut elit tellus, luctus nec ullamcorper.
          </p>
          <p className="text-white">Read More</p>
          <Picture src="/images/paw.png" className="absolute z-0 top-4 right-4 w-24 opacity-10" priority={false} />
        </div>
      </div>
    </div>
  )
}

export default HighlightCards
