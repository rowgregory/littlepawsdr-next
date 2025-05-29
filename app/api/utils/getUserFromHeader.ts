import { createLog } from 'app/utils/logHelper'
import { NextRequest } from 'next/server'

interface User {
  id?: string
  email?: string
}

export async function getUserFromHeader(req: NextRequest): Promise<User | null | Response> {
  const userHeader = req.headers.get('x-user')

  if (!userHeader) return null

  try {
    return JSON.parse(userHeader)
  } catch (error: any) {
    await createLog('error', 'Failed to parse x-user header', {
      header: userHeader,
      message: error.message,
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString()
    })

    return new Response(JSON.stringify({ message: 'Invalid x-user header format' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
