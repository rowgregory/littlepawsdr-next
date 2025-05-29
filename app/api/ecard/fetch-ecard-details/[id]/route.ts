import { NextRequest, NextResponse } from 'next/server'
import ECard from 'models/ecardModel'
import { createLog } from 'app/utils/logHelper'
import startMongoSession from 'app/api/utils/startMonogoSession'
import { sliceEcard } from '@public/data/api.data'

export async function GET(req: NextRequest, { params }: any) {
  let session = null

  try {
    session = await startMongoSession()

    const parameters = await params
    const id = parameters.id
    if (!id) {
      return NextResponse.json({ message: 'Ecard ID is required' }, { status: 400 })
    }

    const ecard = await ECard.findById(id).session(session)

    if (!ecard) {
      return NextResponse.json({ message: 'Ecard not found', sliceName: sliceEcard }, { status: 404 })
    }

    await session.commitTransaction()

    return NextResponse.json({ ecard, sliceName: sliceEcard })
  } catch (error: any) {
    if (session) {
      await session.abortTransaction()
    }

    await createLog('error', 'Error fetching ecard details', {
      functionName: 'GET_ECARD_DETAILS_ADMIN',
      name: error.name,
      message: error.message,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
      user: undefined
    })

    return NextResponse.json({ message: 'Error fetching ecard details', sliceName: sliceEcard }, { status: 500 })
  } finally {
    if (session) {
      session.endSession()
    }
  }
}
