'use client'

import AdminCommandArea from 'app/components/admin/AdminCommandArea'
import CampaignCoverPhotoForm from 'app/forms/CampaignCoverPhotoForm'
import React from 'react'

const CampaignCoverPhotoDetails = () => {
  return (
    <>
      <AdminCommandArea type="CAMPAIGN_COVER_PHOTO" />
      <CampaignCoverPhotoForm />
    </>
  )
}

export default CampaignCoverPhotoDetails
