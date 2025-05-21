'use client'

import React from 'react'
import Link from 'next/link'
import { useAppDispatch } from '@redux/store'
import { setOpenDrawer } from '@redux/features/dashboardSlice'
import { useParams } from 'next/navigation'
import useCustomPathname from '@hooks/useCustomPathname'
import { ADMIN_CAMPAIGN_BASE_URL, getDynamicNestedPathCampaignUrl } from 'app/utils/url.functions'

const CampaignSidebar = () => {
  const path = useCustomPathname()
  const dispatch = useAppDispatch()
  const { campaignId } = useParams()
  const DETAILS_URL = getDynamicNestedPathCampaignUrl(campaignId, path, 'details', null)
  const COVER_PHOTO_URL = getDynamicNestedPathCampaignUrl(campaignId, path, 'details', 'cover-photo')
  const SHARING_URL = getDynamicNestedPathCampaignUrl(campaignId, path, 'details', 'sharing')
  const linkStyles = (active: boolean) =>
    `${active ? 'text-azure dark:text-amathystglow font-semibold' : 'text-black dark:text-zinc-200'} text-17`

  const sidebar: Record<string, JSX.Element> = {}

  if (path === ADMIN_CAMPAIGN_BASE_URL) {
    sidebar[ADMIN_CAMPAIGN_BASE_URL] = (
      <button
        onClick={() => dispatch(setOpenDrawer())}
        className="bg-azure dark:bg-celestialdrift text-white rounded-2xl px-5 py-1.5 text-xs"
      >
        Create campaign
      </button>
    )
  }

  if (campaignId && path?.includes(`${campaignId}`)) {
    sidebar['TITLE'] = <div className="text-shadow dark:text-zinc-200">TITLE</div>
  }

  if (path?.includes('details')) {
    sidebar['DETAILS_SECTION'] = (
      <div className="flex flex-col gap-y-2">
        <Link href={DETAILS_URL.url} className={linkStyles(DETAILS_URL.active)}>
          Overview
        </Link>
        <Link href={COVER_PHOTO_URL.url} className={linkStyles(COVER_PHOTO_URL.active)}>
          Cover Photo
        </Link>
        <Link href={SHARING_URL.url} className={linkStyles(SHARING_URL.active)}>
          Sharing
        </Link>
      </div>
    )
  }

  return (
    <aside className="hidden 990:block md:col-span-3">
      {Object.entries(sidebar).map(([key, element]) => (
        <div key={key}>{element}</div>
      ))}
    </aside>
  )
}

export default CampaignSidebar
