import { NextRequest, NextResponse } from 'next/server'
import Order from 'models/orderModel'
import { createLog } from 'app/utils/logHelper'
import startMongoSession from 'app/api/utils/startMonogoSession'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const paymentIntentId = searchParams.get('paymentIntentId')

  if (!paymentIntentId) {
    return NextResponse.json({ message: 'Missing paymentIntentId' }, { status: 400 })
  }

  const session = await startMongoSession()
  try {
    const order = await Order.findOne({ paymentIntentId })
      .populate([{ path: 'adoptFee' }])
      .session(session)
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    if (!order.adoptFee?.token) {
      await session.endSession()
      return NextResponse.json({ message: 'No adoptFee on order' }, { status: 204 })
    }

    const response = NextResponse.json({ order, message: 'Adopt fee token set' }, { status: 200 })

    response.cookies.set('adoptFeeToken', order.adoptFee.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })

    response.cookies.set('feeExp', order.adoptFee?.exp?.toString() ?? '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: order.adoptFee?.exp ? order.adoptFee?.exp - Math.floor(Date.now() / 1000) : 1800,
      path: '/'
    })

    await session.commitTransaction()
    session.endSession()
    return response
  } catch (error: any) {
    await session.abortTransaction()
    session.endSession()

    await createLog('error', 'Set', {
      functionName: 'GET_orderByPaymentIntent',
      name: error.name,
      message: error.message,
      location: ['order route - GET /api/order-by-paymentIntent'],
      method: 'GET',
      url: '/api/order-by-paymentIntent',
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
