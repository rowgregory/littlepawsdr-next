'use client'

import { RootState, useAppSelector } from '@redux/store'
import FloralNovaLoader from 'app/components/common/FloralNovaLoader'
import CampaignCard from 'app/components/admin/campaign/CampaignCard'

const Campaigns = () => {
  const { campaigns, totalGrossCampaignRevenue, loading, error } = useAppSelector((state: RootState) => state.campaign)

  return (
    <>
      {loading ? (
        <FloralNovaLoader />
      ) : error ? (
        <div className="text-red-500 text-xs">{error}</div>
      ) : (
        <div className="grid grid-cols-12 gap-6">
          {campaigns?.map((campaign: any) => (
            <CampaignCard
              key={campaign?._id}
              title={campaign?.title}
              campaignId={campaign?._id}
              startDate={campaign?.auction?.settings?.startDate}
              totalGrossCampaignRevenue={totalGrossCampaignRevenue}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default Campaigns
