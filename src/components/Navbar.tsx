import cookie from '@/lib/cookie';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = cookie.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setRole(payload.role);
      setIsLogin(true);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Perpustakaan</title>
      </Head>

      <header aria-label="Site Header" className="bg-white">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
          <Link className="block text-teal-600" href="/">
            <span className="sr-only">Home</span>
            <img src="/favicon.ico" alt="Icon" width={30} />
          </Link>
          <div className="flex flex-1 items-center justify-end md:justify-between">
            <div></div>
            <div className="flex items-center gap-4">
              <div className="sm:flex sm:gap-4">
                <Link
                  className="block rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-pink-600 "
                  href={isLogin ? (role == 'pustakawan' ? '/pustakawan' : '/user') : `/auth/login`}
                >
                  {isLogin ? 'Dashboard' : 'Login'}
                </Link>
                {!isLogin && (
                  <Link
                    className="block rounded-md bg-gray-50 px-5 py-2.5 text-sm font-medium text-primary hover:bg-pink-100 hover:text-pink-700"
                    href="/auth/register"
                  >
                    Register
                  </Link>
                )}
              </div>
              <button className="block rounded bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden">
                <span className="sr-only">Toggle menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
