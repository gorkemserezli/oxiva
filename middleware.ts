import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
)

export async function middleware(request: NextRequest) {
  // Admin rotalarını kontrol et
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Login sayfasını muaf tut
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }

    // API rotalarını kontrol et
    if (request.nextUrl.pathname.startsWith('/api/admin')) {
      return NextResponse.next()
    }

    // Token kontrolü
    const token = request.cookies.get('adminToken')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      // Token'ı doğrula
      await jwtVerify(token, JWT_SECRET)
      return NextResponse.next()
    } catch (error) {
      console.error('Invalid token:', error)
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}