import { NextRequest, NextResponse } from 'next/server'
import Ecard from 'models/ecardModel'
import { createLog } from 'app/utils/logHelper'
import { getUserFromHeader } from 'app/api/utils/getUserFromHeader'
import startMongoSession from 'app/api/utils/startMonogoSession'
import { sliceEcard } from '@public/data/api.data'

export async function PUT(req: NextRequest) {
  const user = await getUserFromHeader(req)
  if (user instanceof NextResponse) return user

  let session = null
  try {
    const body = await req.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ message: 'Ecard ID is required', sliceName: sliceEcard }, { status: 400 })
    }

    session = await startMongoSession()

    const updatedEcard = await Ecard.findByIdAndUpdate(id, updateData, {
      new: true,
      session
    })

    if (!updatedEcard) {
      await session.abortTransaction()
      return NextResponse.json({ message: 'Ecard not found', sliceName: sliceEcard }, { status: 404 })
    }

    await session.commitTransaction()

    return NextResponse.json({
      message: 'Ecard updated',
      sliceName: 'ecardApi',
      updatedEcard
    })
  } catch (error: any) {
    if (session) {
      await session.abortTransaction()
    }

    await createLog('error', 'Error updating ecard', {
      functionName: 'UPDATE_ECARD_ADMIN',
      name: error.name,
      message: error.message,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
      user: user && !(user instanceof Response) ? { id: user.id, email: user.email } : undefined
    })

    return NextResponse.json({ message: 'Error updating ecard', sliceName: sliceEcard }, { status: 500 })
  } finally {
    if (session) {
      session.endSession()
    }
  }
}
