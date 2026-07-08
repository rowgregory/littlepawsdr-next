import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const URL_REDIRECTS: Record<string, string> = {
  '/available': '/dachshunds'
}

// Auth.js database-strategy session cookie names.
// __Secure- prefix is used in production (https), plain name in dev.
const SESSION_COOKIES = ['authjs.session-token', '__Secure-authjs.session-token']

function hasSessionCookie(request: NextRequest): boolean {
  return SESSION_COOKIES.some((name) => !!request.cookies.get(name)?.value)
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Static redirects — no auth needed
  if (URL_REDIRECTS[pathname]) {
    return NextResponse.redirect(new URL(URL_REDIRECTS[pathname], request.url), {
      status: 301
    })
  }

  const isLoggedIn = hasSessionCookie(request)

  // Adoption application — cookie-only gate
  if (pathname === '/adopt/application') {
    const hasFeeCookie = request.cookies.get('lpdr_active_adoption_fee')?.value === '1'
    if (hasFeeCookie) {
      if (!isLoggedIn) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
      return NextResponse.redirect(new URL('/adopt/application/apply', request.url))
    }
    return NextResponse.next()
  }

  // Bounce logged-in users away from the login page
  if (pathname === '/auth/login' && isLoggedIn) {
    const redirect = request.cookies.get('lpdr_redirect')?.value
    const response = NextResponse.redirect(new URL(redirect || '/member/portal', request.url))
    response.cookies.delete('lpdr_redirect')
    return response
  }

  // Protected routes: cookie-existence check only. The authenticated layouts
  // do the real session validation + role checks on the Node runtime.
  const isProtected = ['/member/', '/admin/'].some((r) => pathname.startsWith(r))
  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/member/:path*', '/admin/:path*', '/auth/login', '/adopt/application', '/available']
}
