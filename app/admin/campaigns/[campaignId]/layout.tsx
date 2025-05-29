'use client'

import React, { FC, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { setCurrentCampaign } from '@redux/features/campaignSlice'
import { RootState, useAppDispatch, useAppSelector } from '@redux/store'
import { LayoutProps } from 'app/types/common.types'

const CampaignIdLayout: FC<LayoutProps> = ({ children }) => {
  const { campaignId } = useParams() as string & void
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((state: RootState) => state.campaign)

  useEffect(() => {
    if (loading) return

    dispatch(setCurrentCampaign(campaignId))
  }, [campaignId, dispatch, loading])

  return <div>{children}</div>
}

export default CampaignIdLayout
