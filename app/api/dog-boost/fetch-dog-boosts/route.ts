import { NextRequest, NextResponse } from 'next/server'
import DogBoostDog from 'models/dogBoostDogModel'
import 'models/dogBoostProductModel'
import { parseStack } from 'error-stack-parser-es/lite'
import { createLog } from 'app/utils/logHelper'
import { getUserFromHeader } from 'app/api/utils/getUserFromHeader'
import startMongoSession from 'app/api/utils/startMonogoSession'

export async function GET(req: NextRequest) {
  const user = await getUserFromHeader(req)
  if (user instanceof NextResponse) return user

  let session = null

  try {
    session = await startMongoSession()

    const DogBoosts = await DogBoostDog.find({})
      .populate({
        path: 'associatedProducts',
        select: 'name',
        model: 'DogBoostProduct'
      })
      .session(session) // use the session here

    await session.commitTransaction()

    return NextResponse.json({ DogBoosts })
  } catch (error: any) {
    if (session) await session.abortTransaction()

    await createLog('error', `Failed to fetch dog boosts: ${error.message}`, {
      location: ['dog-boost route - GET /api/dog-boost/fetch-dog-boosts'],
      message: 'Error fetching dog boosts',
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      user: user && !(user instanceof Response) ? { id: user.id, email: user.email } : undefined
    })

    return NextResponse.json({ message: 'Database connection failed' }, { status: 500 })
  } finally {
    if (session) session.endSession()
  }
}
