import { NextRequest, NextResponse } from 'next/server'
import { createLog } from 'app/utils/logHelper'
import { getBypassCode } from 'app/api/utils/dashboard/getBypassCode'
import { getDogBoostData } from 'app/api/utils/dashboard/getDogBoostData'
import { getECardData } from 'app/api/utils/dashboard/getEcardData'
import { getUserFromHeader } from 'app/api/utils/getUserFromHeader'
import startMongoSession from 'app/api/utils/startMonogoSession'

export async function GET(req: NextRequest) {
  const user = await getUserFromHeader(req)
  if (user instanceof NextResponse) return user

  let session = null

  try {
    session = await startMongoSession()

    const bypassCode = await getBypassCode()
    const dogBoost = await getDogBoostData()
    const ecard = await getECardData()

    await session.commitTransaction()

    return NextResponse.json({ bypassCode, dogBoost, ecard }, { status: 200 })
  } catch (error: any) {
    if (session) await session.abortTransaction()

    await createLog('error', 'Error in fetchDashboardData', {
      functionName: 'GET_DASHBOARD_DATA_ADMIN',
      name: error.name,
      message: error.message,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
      user: user && !(user instanceof Response) ? { id: user.id, email: user.email } : undefined
    })

    return NextResponse.json(
      {
        message: 'Server error while fetching dashboard data',
        sliceName: 'dashboardApi'
      },
      { status: 500 }
    )
  } finally {
    if (session) session.endSession()
  }
}
