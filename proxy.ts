import { NextResponse } from 'next/server'
import { auth } from './app/lib/auth'

const URL_REDIRECTS: Record<string, string> = {
  '/available': '/dachshunds'
}

export async function proxy(request) {
  const { pathname } = request.nextUrl
  const session = await auth()
  const role = session?.user?.role

  // Handle URL redirects
  if (URL_REDIRECTS[pathname]) {
    return NextResponse.redirect(new URL(URL_REDIRECTS[pathname], request.url), { status: 301 })
  }

  if (pathname === '/auth/login' && role) {
    const redirect = request.cookies.get('lpdr_redirect')?.value

    if (role === 'ADMIN' || role === 'SUPERUSER') return NextResponse.redirect(new URL('/admin/dashboard', request.url))

    const response = NextResponse.redirect(new URL(redirect || '/member/portal', request.url))
    response.cookies.delete('lpdr_redirect')
    return response
  }

  if (pathname === '/adopt/application' && session?.user?.id) {
    const hasFeeCookie = request.cookies.get('lpdr_active_adoption_fee')?.value === '1'
    if (hasFeeCookie) {
      return NextResponse.redirect(new URL('/adopt/application/apply', request.url))
    }
    return NextResponse.next()
  }

  // Protected routes
  const isProtected = ['/member/', '/admin/'].some((r) => pathname.startsWith(r))
  if (!isProtected) return NextResponse.next()

  // Unauthenticated — send to login
  if (!role) return NextResponse.redirect(new URL('/auth/login', request.url))

  // Admin routes
  if (pathname.startsWith('/admin/')) {
    if (role !== 'ADMIN' && role !== 'SUPERUSER') return NextResponse.redirect(new URL('/member/portal', request.url))
    return NextResponse.next()
  }

  // Supporter routes
  if (pathname.startsWith('/member/')) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/member/:path*', '/admin/:path*', '/auth/login', '/adopt/application']
}
