import React from 'react'
import Picture from '../common/Picture'
import Icon from '../common/Icon'
import { calendarIcon, marsIcon, venusIcon } from 'app/icons'
import { extractYears } from 'app/utils/dachshundHelpers'
import Link from 'next/link'
import { DACHSHUNDS_BASE_URL } from '@public/static-data/paths'

const DachshundCard = ({ obj, animate, delay }: { obj: any; animate: boolean; delay: string }) => {
  return (
    <Link
      href={`${DACHSHUNDS_BASE_URL}/${obj?.id}`}
      className={`col-span-12 sm:col-span-6 md:col-span-3 transition-transform transform  ${
        animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: delay }}
    >
      <Picture
        src={obj?.attributes?.photos[0] || '/images/no-img.jpg'}
        className="w-full aspect-square rounded-2xl object-cover mb-5"
        priority={false}
      />
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center">
          <Icon icon={calendarIcon} className="text-teal-400 w-4 h-4" />
          <p className="text-color mt-1.5 ml-1">{extractYears(obj?.attributes?.ageString)}</p>
        </div>
        <div className="flex items-center">
          <Icon icon={obj?.attributes?.sex === 'Male' ? marsIcon : venusIcon} className="text-teal-400 w-4 h-4" />
          <p className="text-color mt-1.5 ml-1">{obj?.attributes?.sex}</p>
        </div>
      </div>
      <h1 className="text-color text-22 mb-2 font-QBold truncate">{obj?.attributes?.name}</h1>
      <p className="text-color font-QLight truncate mb-4">{obj?.attributes?.descriptionText}</p>
      <p className="text-teal-400 font-QBold">Read More</p>
    </Link>
  )
}

export default DachshundCard
