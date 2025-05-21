'use client'

import React, { FC } from 'react'
import Picture from '../common/Picture'
import { ShopToHelpCardProps } from 'app/types/donate-types'

const ShopToHelpCard: FC<ShopToHelpCardProps> = ({ obj }) => {
  return (
    <div
      onClick={() => window.open(obj.linkKey, '_blank')}
      className="col-span-12 sm:col-span-6 p-6 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)] bg-white flex flex-col cursor-pointer group overflow-hidden"
    >
      <Picture
        src={obj.img}
        className="w-full aspect-video object-contain max-w-xs self-center group-hover:scale-110 duration-300 mb-10"
        priority={false}
      />
      <p>{obj.textKey}</p>
    </div>
  )
}

export default ShopToHelpCard
