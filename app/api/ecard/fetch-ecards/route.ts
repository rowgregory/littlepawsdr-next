import { NextRequest, NextResponse } from 'next/server'
import ECard from 'models/ecardModel'
import { createLog } from 'app/utils/logHelper'
import startMongoSession from 'app/api/utils/startMonogoSession'
import { sliceEcard } from '@public/data/api.data'

export async function GET(req: NextRequest) {
  let session = null

  try {
    session = await startMongoSession()

    const ecards = await ECard.find({
      name: { $nin: ['Valentine Alice', 'Valentine Daphne'] }
    })
      .session(session)
      .sort({ updated: -1 })

    const categories = [...new Set(ecards.map((ecard) => ecard.category))]

    await session.commitTransaction()

    return NextResponse.json({ ecards, categories, sliceName: sliceEcard })
  } catch (error: any) {
    if (session) {
      await session.abortTransaction()
    }

    await createLog('error', 'Error fetching eCards list', {
      functionName: 'GET_ECARDS_LIST_PUBLIC',
      name: error.name,
      message: error.message,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ message: 'Error fetching ecards', sliceName: sliceEcard }, { status: 500 })
  } finally {
    if (session) {
      session.endSession()
    }
  }
}
