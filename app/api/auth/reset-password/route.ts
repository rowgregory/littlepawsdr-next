import User from 'models/userModel'
import connectDB from 'app/lib/mongo/db'
import { createLog } from 'app/utils/logHelper'
import { parseStack } from 'error-stack-parser-es/lite'
import { NextRequest, NextResponse } from 'next/server'
import argon2 from 'argon2'

const sliceName = 'authApi'

export async function PATCH(req: NextRequest) {
  await connectDB()
  const { password, id } = await req.json()

  try {
    const user = await User.findById(id)

    if (!user) {
      return NextResponse.json({ message: 'User not found', sliceName }, { status: 404 })
    }

    const hashedPassword = await argon2.hash(password)

    user.password = hashedPassword

    await user.save()

    await createLog('info', 'Password reset successful', {
      location: ['auth route - PATCH /api/auth/reset-password'],
      name: 'ResetPasswordSuccess',
      userId: user._id.toString(),
      email: user.email,
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })

    return NextResponse.json(
      {
        success: true,
        sliceName
      },
      { status: 200 }
    )
  } catch (error: any) {
    await createLog('error', `Reset password failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      id
    })

    return NextResponse.json({ message: 'Password reset failed', sliceName }, { status: 500 })
  }
}
