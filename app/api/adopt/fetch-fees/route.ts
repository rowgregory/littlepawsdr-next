import { NextRequest, NextResponse } from 'next/server'
import connectDB from 'app/lib/mongo/db'
import { createLog } from 'app/utils/logHelper'
import AdoptionFee from 'models/adoptionFeeModel'

export async function GET(req: NextRequest) {
  await connectDB()

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

  try {
    const adoptionApplicationFees = await AdoptionFee.find({}).sort({
      createdAt: -1
    })

    return NextResponse.json({ adoptionApplicationFees }, { status: 200 })
  } catch (error: any) {
    await createLog('error', 'Error fetching adoption fees', {
      functionName: 'GET_ADOPTION_APPLICATION_FEE_LIST_PRIVATE',
      name: error.name,
      message: error.message,
      location: ['adoptionFee route - GET /api/adoption-fee'],
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString(),
      user: user ? { id: user.id, email: user.email } : undefined
    })

    return NextResponse.json(
      {
        message: 'Error fetching adoption fees',
        sliceName: 'adoptionApplicationFeeApi'
      },
      { status: 500 }
    )
  }
}
