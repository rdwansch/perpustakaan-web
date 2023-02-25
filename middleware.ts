import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const user = { role: 'admin', username: 'ujklm23' };

  if (user.role == 'admin') {
    return NextResponse.redirect(new URL('/admin', request.url));
  } else if (user.role == 'user') {
    return NextResponse.redirect(new URL('/user', request.url));
  }

  // Unauthorize
  return NextResponse.redirect(new URL('/auth/login', request.url));
}

// Middleware hanya akan dijalankan sesuai matcher
export const config = {
  matcher: ['/user/:path*', '/admin/:path*'],
};
