import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { useContext } from 'react';
// import { userContext } from '@/lib/context';
import useAuth from '@/lib/AuthHook';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest): Promise<NextResponse> {
  // Semoga suatu saat context berguna
  // const { state, dispatch } = useContext(userContext);

  let _Next: NextResponse;

  if (request.nextUrl.pathname == '/auth') {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  } else if (request.nextUrl.pathname == '/user') {
    return NextResponse.redirect(new URL('/user/peminjaman', request.url));
  }

  const _user = await useAuth(request.cookies);

  // Jika cookie kosong / salah maka akan redirect dan hapus cookie
  if (_user == 'UNAUTHORIZE') {
    _Next = NextResponse.redirect(new URL('/auth/login', request.url));
    _Next.cookies.delete('token');
    return _Next;
  }

  return NextResponse.next();
}

// Middleware hanya akan dijalankan sesuai matcher
export const config = {
  matcher: ['/pustakawan/:path*', '/user/:path*', '/auth'],
};
