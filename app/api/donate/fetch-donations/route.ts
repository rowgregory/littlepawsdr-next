import mongoose from 'mongoose'
import Donation from 'models/donationModel'
import { NextRequest, NextResponse } from 'next/server'
import { createLog } from 'app/utils/logHelper'
import { parseStack } from 'error-stack-parser-es/lite'

export async function GET(req: NextRequest) {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const donations = await Donation.find({}).session(session)

    await session.commitTransaction()
    session.endSession()

    return NextResponse.json({ donations }, { status: 200 })
  } catch (error: any) {
    await session.abortTransaction()
    session.endSession()

    await createLog('error', `Failed to fetch donations: ${error.message}`, {
      location: ['donate route - GET /api/donate/fetch-donations'],
      message: 'Error fetching donations',
      errorLocation: parseStack(error.stack || ''),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })

    return NextResponse.json({ message: 'Failed to fetch donations' }, { status: 500 })
  }
}
