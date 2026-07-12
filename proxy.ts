import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Auth.js database-strategy session cookie names.
// __Secure- prefix is used in production (https), plain name in dev.
const SESSION_COOKIES = ['authjs.session-token', '__Secure-authjs.session-token']

const hasSessionCookie = (req: NextRequest) => SESSION_COOKIES.some((name) => !!req.cookies.get(name)?.value)

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLoggedIn = hasSessionCookie(request)

  // Bounce logged-in users away from the login page
  if (pathname === '/auth/login' && isLoggedIn) {
    const redirect = request.cookies.get('lpdr_redirect')?.value
    const response = NextResponse.redirect(new URL(redirect || '/my-pack', request.url))
    response.cookies.delete('lpdr_redirect')
    return response
  }

  // Protected routes — cookie-existence check only.
  // Authenticated layouts do the real session validation + role checks on Node.
  const isProtected = ['/my-pack/', '/admin/'].some((r) => pathname.startsWith(r))
  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/my-pack/:path*', '/admin/:path*', '/auth/login', '/adopt/application']
}
