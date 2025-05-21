'use client'

import React, { FC } from 'react'
// import Link from 'next/link'
// import ActionButton from './AdminActionButton'
import { useAppDispatch } from '@redux/store'

const commandAreaText = {
  CAMPAIGN_LIST: {
    title: 'Campaign List',
    p1: `Manage and edit existing campaigns or create new ones anytime, anywhere.`
  },
  CAMPAIGN_OVERVIEW: {
    title: 'Overview',
    p1: `All the details you need for the current campaign, from start to finish, including key dates, objectives, and visuals.`
  },
  CAMPAIGN_COVER_PHOTO: {
    title: 'Cover Photo',
    p1: `This section allows you to upload and manage the cover photo for your campaign. The cover photo is a key visual that appears on the public campaign overview page and should capture the essence of your campaign. Update the cover photo to make your campaign visually engaging and aligned with its theme.`
  },
  CAMPAIGN_SHARING_DETAILS: {
    title: 'Sharing',
    p1: `This section provides the tools for sharing your campaign with others. A unique QR code has already been generated for easy sharing across physical and digital channels. You can also update the custom campaign link, which is a unique identifier in the URL that directly leads to the campaign page. Use the button below to quickly copy the link for easy sharing. Customize the link to enhance the campaign's branding and make it more memorable.`
  }
} as any

const AdminCommandArea: FC<{ type: string; btnText?: string }> = ({ type, btnText }) => {
  const dispatch = useAppDispatch()

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col 1160:flex-row gap-y-16 1160:gap-x-16">
        <div className="flex flex-col w-full font-sf">
          <h1 className="text-[28px] font-bold text-shadow dark:text-white">{commandAreaText?.[type]?.title}</h1>
          <p className="mt-[15px] mb-3 text-shadowSteel dark:text-zinc-300 w-full 760:w-2/3 text-sm">{commandAreaText[type]?.p1}</p>
          {/* {commandAreaText?.[type]?.p2 && (
            <p className="text-zinc-300 font-light w-full 760:w-2/3 text-17 mb-2">{commandAreaText?.[type]?.p2}</p>
          )}
          {commandAreaText?.[type]?.func && btnText && <ActionButton text={btnText} onClick={() => dispatch(commandAreaText[type].func)} />}
          {commandAreaText?.[type]?.link && (
            <div className="flex flex-col 760:flex-row 760:items-center gap-x-2 mt-5">
              <h3 className="text-sm font-light text-[#b0b0b2] mb-2 760:mb-0">
                See how your {commandAreaText?.[type]?.title?.toLowerCase()} are displayed to customers on the public page.
              </h3>
              <Link href={commandAreaText?.[type]?.link} className={`font-rubik font-light text-sm w-fit`} style={{ color: '#00c5d9' }}>
                View Public {commandAreaText?.[type]?.title}
              </Link>
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}

export default AdminCommandArea
