// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const role = request.cookies.get('nwspl_role')?.value;
  const department = request.cookies.get('nwspl_department')?.value; // NEW
  const path = request.nextUrl.pathname;

  if (!role && path !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (path.startsWith('/super-admin') && role !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/employee', request.url));
  }

  if (path.startsWith('/department') && role !== 'SUB_ADMIN' && role !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/employee', request.url));
  }

  // NEW: Protect HR Dashboard
  if (path.startsWith('/hr') && department !== 'HR' && role !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/employee', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/super-admin/:path*', '/department/:path*', '/hr/:path*', '/employee/:path*','/profile'],
};