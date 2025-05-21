'use client'

import React from 'react'
import AdminCommandArea from 'app/components/admin/AdminCommandArea'
import CampaignSharingForm from 'app/forms/CampaignSharingForm'

const CampaignSharingDetails = () => {
  return (
    <>
      <AdminCommandArea type="CAMPAIGN_SHARING_DETAILS" />
      <CampaignSharingForm />
    </>
  )
}

export default CampaignSharingDetails
