import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

const allowedOrigins = [
  'https://cb32-174-169-161-92.ngrok-free.app',
  'http://localhost:3000'
  // Add more allowed origins if needed
]

function createCorsHeaders(origin: string) {
  const headers = new Headers()
  if (allowedOrigins.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie')
    headers.set('Access-Control-Allow-Credentials', 'true')
  }
  return headers
}

function addCorsToResponse(response: NextResponse, origin: string) {
  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }
  return response
}

export async function middleware(req: NextRequest) {
  const origin = req.headers.get('origin') || ''
  const { pathname } = req.nextUrl
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    const headers = createCorsHeaders(origin)
    return new Response(null, {
      status: 200,
      headers
    })
  }

  // If this is an API route, just add CORS and continue
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next()
    return addCorsToResponse(response, origin)
  }

  const token = req.cookies.get('adoptFeeToken')?.value
  const step1Complete = req.cookies.get('adoptStep1Complete')?.value === 'true'
  const step2Complete = req.cookies.get('adoptStep2Complete')?.value === 'true'
  const step3Complete = req.cookies.get('adoptStep3Complete')?.value === 'true'
  const currentTime = Math.floor(Date.now() / 1000)

  const isStep2 = pathname === '/adopt/application/step2'
  const isStep3 = pathname === '/adopt/application/step3'
  const isStep4 = pathname === '/adopt/application/step4'
  const isRootApp = pathname === '/adopt/application'

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      if (payload.exp && payload.exp > currentTime) {
        // Valid token — redirect to step4 unless already there
        if (!isStep4) {
          const response = NextResponse.redirect(new URL('/adopt/application/step4', req.url))
          return addCorsToResponse(response, origin)
        }
        const response = NextResponse.next()
        return addCorsToResponse(response, origin)
      } else {
        // Token expired — delete and redirect to step1
        const response = NextResponse.redirect(new URL('/adopt/application/step1', req.url))
        response.cookies.delete('adoptAppToken')
        return addCorsToResponse(response, origin)
      }
    } catch {
      // Invalid token — delete and redirect to step1
      const response = NextResponse.redirect(new URL('/adopt/application/step1', req.url))
      response.cookies.delete('adoptAppToken')
      return addCorsToResponse(response, origin)
    }
  }

  // No token or invalid token handled above
  // Redirect root /adopt/application to step1 if no valid token
  if (isRootApp) {
    const response = NextResponse.redirect(new URL('/adopt/application/step1', req.url))
    return addCorsToResponse(response, origin)
  }

  // Step gating logic:
  if (isStep2 && !step1Complete) {
    const response = NextResponse.redirect(new URL('/adopt/application/step1', req.url))
    return addCorsToResponse(response, origin)
  }

  if (isStep3 && !step2Complete) {
    const response = NextResponse.redirect(new URL('/adopt/application/step2', req.url))
    return addCorsToResponse(response, origin)
  }

  if (isStep4 && !step3Complete) {
    const response = NextResponse.redirect(new URL('/adopt/application/step3', req.url))

    return addCorsToResponse(response, origin)
  }

  const response = NextResponse.next()
  return addCorsToResponse(response, origin)
}

export const config = {
  matcher: ['/adopt/application/:path*', '/api/:path*']
}
