import { NextRequest, NextResponse } from 'next/server'
import Ecard from 'models/ecardModel'
import { createLog } from 'app/utils/logHelper'
import { getUserFromHeader } from 'app/api/utils/getUserFromHeader'
import startMongoSession from 'app/api/utils/startMonogoSession'
import { sliceEcard } from '@public/data/api.data'

export async function POST(req: NextRequest) {
  const user = await getUserFromHeader(req)
  if (user instanceof NextResponse) return user

  let session = null
  try {
    const body = await req.json()

    if (!body.name || !body.category) {
      return NextResponse.json({ message: 'Name and category are required', sliceName: sliceEcard }, { status: 400 })
    }

    session = await startMongoSession()

    const newEcard = new Ecard(body)
    await newEcard.save({ session })

    await session.commitTransaction()

    return NextResponse.json({
      message: 'Ecard created',
      sliceName: 'ecardApi',
      newEcard
    })
  } catch (error: any) {
    if (session) {
      await session.abortTransaction()
    }

    await createLog('error', 'Error creating ecard', {
      functionName: 'CREATE_ECARD_ADMIN',
      name: error.name,
      message: error.message,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
      user: user && !(user instanceof Response) ? { id: user.id, email: user.email } : undefined
    })

    return NextResponse.json({ message: 'Error creating ecard', sliceName: sliceEcard }, { status: 500 })
  } finally {
    if (session) {
      session.endSession()
    }
  }
}
