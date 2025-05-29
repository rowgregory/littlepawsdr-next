import { NextRequest, NextResponse } from 'next/server'
import { createLog } from 'app/utils/logHelper'
import startMongoSession from 'app/api/utils/startMonogoSession'
import AuctionItem from 'models/auctionItemModel'
import AuctionItemPhoto from 'models/auctionItemPhotoModel'
import Auction from 'models/auctionModel'

export async function DELETE(req: NextRequest) {
  const session = await startMongoSession()

  // Parse user from x-user header
  let user: { id?: string; email?: string } | null = null
  const userHeader = req.headers.get('x-user')
  if (userHeader) {
    try {
      user = JSON.parse(userHeader)
    } catch (parseError: any) {
      await createLog('error', 'Failed to parse x-user header', {
        header: userHeader,
        message: parseError.message,
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url
      })
      return NextResponse.json({ message: 'Invalid x-user header format' }, { status: 400 })
    }
  }

  const auctionItemId = req.nextUrl.pathname.split('/').pop()

  try {
    const auctionItem = await AuctionItem.findById(auctionItemId).session(session)

    if (auctionItem) {
      const photoIds = auctionItem.photos
      await AuctionItemPhoto.deleteMany({ _id: { $in: photoIds } }).session(session)

      await Auction.findByIdAndUpdate(auctionItem.auction, { $pull: { items: auctionItemId } }, { new: true }).session(session)

      await auctionItem.deleteOne({ session })
    }

    await session.commitTransaction()
    session.endSession()

    return NextResponse.json({ _id: auctionItem.id, message: 'Auction item deleted', sliceName: 'campaignApi' }, { status: 200 })
  } catch (error: any) {
    await session.abortTransaction()
    session.endSession()

    await createLog('error', 'Error deleting auction item', {
      functionName: 'DELETE_AUCTION_ITEM',
      name: error.name,
      message: error.message,
      location: ['auctionItem route - DELETE /api/campaign/auction/item/:auctionItemId'],
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString(),
      user: user ? { id: user.id, email: user.email } : undefined
    })

    return NextResponse.json({ message: 'Error deleting auction item', sliceName: 'campaignApi' }, { status: 500 })
  }
}
