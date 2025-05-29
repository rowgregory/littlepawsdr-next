import { Campaign } from 'models/campaignModel'
import connectDB from 'app/lib/mongo/db'
import { NextRequest, NextResponse } from 'next/server'
import { startSession } from 'mongoose'
import { createLog } from 'app/utils/logHelper'
import Auction from 'models/auctionModel'

export async function POST(req: NextRequest) {
  await connectDB()

  const session = await startSession()
  session.startTransaction()

  try {
    const { title } = await req.json()

    // Create auction in transaction
    const auction = await Auction.create([{}], { session })

    // Generate customCampaignLink
    const customCampaignLink = title.substring(0, 6).toUpperCase().replace(/\s+/g, '')

    // Create campaign with auction id, inside session
    const campaign = await Campaign.create(
      [
        {
          auction: auction[0]._id,
          title,
          customCampaignLink
        }
      ],
      { session }
    )

    // Update auction with campaign id, inside session
    await Auction.findByIdAndUpdate(auction[0]._id, { campaign: campaign[0]._id }, { new: true, session })

    await session.commitTransaction()
    session.endSession()

    return NextResponse.json({ campaignId: campaign[0]._id, sliceName: 'campaignApi' }, { status: 200 })
  } catch (error: any) {
    await session.abortTransaction()
    session.endSession()

    await createLog('error', 'Error creating campaign', {
      functionName: 'POST_CREATE_CAMPAIGN',
      name: error.name,
      message: error.message,
      location: ['campaign route - POST /api/campaign/create'],
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ message: 'Error creating campaign', sliceName: 'campaignApi' }, { status: 500 })
  }
}
