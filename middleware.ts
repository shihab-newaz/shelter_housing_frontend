import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  
  // Define which paths require authentication
  const isProtectedPath = path.startsWith('/project-management')
  
  // Get session token
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET
  })
  
  // Redirect logic
  if (isProtectedPath && !token) {
    // Redirect to login page if trying to access protected route without authentication
    const url = new URL('/login', req.url)
    url.searchParams.set('callbackUrl', encodeURI(path))
    return NextResponse.redirect(url)
  }
  
  // Allow the request to continue
  return NextResponse.next()
}

// Configure which paths the middleware applies to
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /_next (Next.js internals)
     * - /api/auth (NextAuth.js API routes)
     * - /static (static files)
     * - /_vercel (Vercel internals)
     * - /favicon.ico, /robots.txt (common files)
     */
    '/((?!_next|api/auth|static|_vercel|favicon.ico|robots.txt).*)',
  ],
}