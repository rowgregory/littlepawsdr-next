'use client'

import React, { FC } from 'react'
import CampaignHeader from 'app/components/admin/campaign/CampaignHeader'
import CampaignSidebar from 'app/components/admin/campaign/CampaignSidebar'
import { useFetchCampaignsQuery } from '@redux/services/campaignApi'
import { LayoutProps } from 'app/types/common.types'

const CampaignsLayout: FC<LayoutProps> = ({ children }) => {
  useFetchCampaignsQuery()

  return (
    <>
      <CampaignHeader />
      <div className="grid grid-cols-12 gap-x-5 pt-7 860:pt-14 min-h-[calc(100vh-100px)] font-sf">
        <CampaignSidebar />
        <main className="col-span-12 md:col-span-9 animate-fade-in">{children}</main>
      </div>
    </>
  )
}

export default CampaignsLayout
