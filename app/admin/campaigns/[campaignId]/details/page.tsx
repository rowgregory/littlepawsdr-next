'use client'

import React from 'react'
import AdminCommandArea from 'app/components/admin/AdminCommandArea'
import CampaignOverviewForm from 'app/forms/CampaignOverviewForm'

const AdminCampaignDetails = () => {
  return (
    <>
      <AdminCommandArea type="CAMPAIGN_OVERVIEW" />
      <CampaignOverviewForm />
    </>
  )
}

export default AdminCampaignDetails
