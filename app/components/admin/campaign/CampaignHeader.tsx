'use client'

import React, { JSX } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import useCustomPathname from '@hooks/useCustomPathname'
import { setOpenDrawer } from '@redux/features/dashboardSlice'
import { useAppDispatch } from '@redux/store'
import { ADMIN_CAMPAIGN_BASE_URL, getDynamicSubPathCampaignUrl } from 'app/utils/url.functions'
import ThemeColors from 'app/components/ThemeColors'

const CampaignHeader = () => {
  const path = useCustomPathname()
  const dispatch = useAppDispatch()
  const { campaignId } = useParams()
  const handleOpenModal = () => dispatch(setOpenDrawer())
  const DETAILS_URL = getDynamicSubPathCampaignUrl(campaignId, path, 'details')
  const AUCTION_URL = getDynamicSubPathCampaignUrl(campaignId, path, 'auction')

  const headers: Record<string, JSX.Element> = {
    [ADMIN_CAMPAIGN_BASE_URL]: (
      <div className="flex items-center justify-between w-full font-sf">
        <h1 className="text-[19px] 860:text-21 text-black dark:text-zinc-200">Campaigns</h1>
        <button onClick={handleOpenModal} className="block md:hidden bg-azure dark:bg-celestialdrift rounded-2xl px-5 py-1.5 text-xs">
          Create campaign
        </button>
        <ThemeColors />
      </div>
    ),
    ...(path?.includes(`${campaignId}`) && {
      [path]: (
        <div className="flex items-center gap-x-4 w-full font-sf">
          <Link
            href={DETAILS_URL.url}
            className={`${
              DETAILS_URL.active ? 'text-azure dark:text-amathystglow' : 'text-black dark:text-zinc-200'
            } text-[19px] 860:text-21`}
          >
            Details
          </Link>
          <Link
            href={AUCTION_URL.url}
            className={`${
              AUCTION_URL.active ? 'text-azure dark:text-amathystglow' : 'text-black dark:text-zinc-200'
            } text-[19px] 860:text-21`}
          >
            Auction
          </Link>
        </div>
      )
    })
  }

  return (
    <header className="border-b-1 border-b-zinc-150 dark:border-b-zinc-700 sticky z-50 top-12 left-0 flex items-center justify-between w-full h-[52px]">
      {headers[path]}
    </header>
  )
}

export default CampaignHeader
