import { NextResponse } from 'next/server'
import { Campaign } from 'models/campaignModel'
import { createLog } from 'app/utils/logHelper'
import startMongoSession from 'app/api/utils/startMonogoSession'
import { sliceCampaign } from '@public/data/api.data'

export async function GET() {
  const session = await startMongoSession()

  try {
    const campaigns = await Campaign.find({})
      .populate([{ path: 'auction', populate: [{ path: 'settings' }] }])
      .session(session)

    const totalGrossCampaignRevenue = campaigns.reduce((total, campaign) => total + (campaign.totalCampaignRevenue || 0), 0)

    await session.commitTransaction()
    session.endSession()

    return NextResponse.json({ campaigns, totalGrossCampaignRevenue, sliceName: sliceCampaign }, { status: 200 })
  } catch (error: any) {
    await session.abortTransaction()
    session.endSession()

    await createLog('error', 'Error fetching campaigns', {
      functionName: 'GET_FETCH_CAMPAIGNS',
      name: error.name,
      message: error.message,
      location: ['campaign/fetch-campaigns GET'],
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ message: 'Error fetching campaigns', sliceName: sliceCampaign }, { status: 500 })
  }
}
