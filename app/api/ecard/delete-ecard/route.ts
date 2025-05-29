import Ecard from 'models/ecardModel'
import { createLog } from 'app/utils/logHelper'
import { NextRequest, NextResponse } from 'next/server'
import { getUserFromHeader } from 'app/api/utils/getUserFromHeader'
import startMongoSession from 'app/api/utils/startMonogoSession'

export async function DELETE(req: NextRequest) {
  const user = await getUserFromHeader(req)
  if (user instanceof Response) return user

  let session = null

  try {
    session = await startMongoSession()

    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({ message: 'Ecard ID is required' }, { status: 400 })
    }

    const ecard = await Ecard.findById(id).session(session)

    if (!ecard) {
      return NextResponse.json({ message: 'Ecard not found' }, { status: 404 })
    }

    await ecard.deleteOne({ session })
    await session.commitTransaction()

    return NextResponse.json({
      message: 'Ecard removed',
      sliceName: 'ecardApi'
    })
  } catch (error: any) {
    if (session) {
      await session.abortTransaction()
    }

    await createLog('error', 'Error deleting ecard', {
      functionName: 'DELETE_ECARD_ADMIN',
      name: error.name,
      message: error.message,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
      user: user ? { id: user.id, email: user.email } : undefined
    })

    return NextResponse.json({ message: 'Error deleting ecard', sliceName: 'ecardApi' }, { status: 500 })
  } finally {
    if (session) {
      session.endSession()
    }
  }
}
