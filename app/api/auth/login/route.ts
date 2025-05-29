import User from 'models/userModel'
import { sliceAuth } from '@public/data/api.data'
import connectDB from 'app/lib/mongo/db'
import { createLog } from 'app/utils/logHelper'
import argon2 from 'argon2'
import { parseStack } from 'error-stack-parser-es/lite'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  await connectDB()

  const { email, password } = await req.json()

  try {
    const user = await User.findOne({ email })

    if (!user || !(await argon2.verify(user.password, password))) {
      await createLog('warn', `Failed login attempt for email: ${email}`, {
        email,
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method
      })
      return NextResponse.json({ message: 'Invalid email or password', sliceName: sliceAuth }, { status: 401 })
    }

    const [firstName, lastName] = user?.name?.split(' ') || []

    if (!user.firstNameFirstInitial || !user.lastNameFirstInitial) {
      user.firstNameFirstInitial = firstName?.charAt(0)
      user.lastNameFirstInitial = lastName?.charAt(0)
    }

    if (!user.firstName || !user.lastName) {
      user.firstName = firstName
      user.lastName = lastName
    }

    const updatedUser = await user.save()

    await createLog('info', `Successful login for user ${email}`, {
      email,
      userId: updatedUser._id.toString(),
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })

    return NextResponse.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      lastLoginTime: updatedUser.lastLoginTime,
      firstNameFirstInitial: updatedUser.firstNameFirstInitial,
      lastNameFirstInitial: updatedUser.lastNameFirstInitial,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      updatedAt: updatedUser.updatedAt
    })
  } catch (error: any) {
    await createLog('error', `Error authenticating user: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      email,
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })

    return NextResponse.json({ message: 'Error authenticating user', sliceName: sliceAuth }, { status: 500 })
  }
}
