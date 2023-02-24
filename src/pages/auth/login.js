import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function Login() {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>

      <section className="bg-white">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          <section className="flex items-center justify-center lg:col-span-5 lg:h-full xl:col-span-6">
            <h1 className="text-4xl font-bold">Perpustakaan Snapan</h1>
          </section>
          <main
            aria-label="Main"
            className="flex items-center justify-center  px-8 py-8 sm:px-12 lg:col-span-7 lg:py-12 lg:px-16 xl:col-span-6"
          >
            <div className="w-8/12 max-w-xl lg:max-w-3xl">
              <form action="#" className="mt-8">
                <div className="mb-5">
                  <label htmlFor="username" className="block font-medium text-gray-700">
                    Username
                  </label>
                  <input type="text" id="username" className="basic-input border-gray-200" />
                </div>
                <div className="mb-5">
                  <label htmlFor="passwd" className="block font-medium text-gray-700">
                    Password
                  </label>
                  <input type="password" id="passwd" className="basic-input border-gray-200" />
                </div>
                <div className="mb-5">
                  <label htmlFor="passwd_confirm" className="block font-medium text-gray-700">
                    Konfirmasi Password
                  </label>
                  <input type="password" id="passwd_confirm" className="basic-input border-gray-200" />
                </div>

                <button className="inline-block shrink-0 rounded-md border border-primary bg-primary px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-primary focus:bg-[#ffffff] focus:text-primary focus:outline-none focus:ring focus:ring-[#ffaadd]">
                  Buat Akun
                </button>
                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                  Belum punya akun? &nbsp;
                  <Link
                    href="/auth/register"
                    className="relative text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:w-0 after:rounded-full after:bg-gradient-to-r after:from-primary after:to-[#ff44b4] after:transition-[width] after:content-[''] after:hover:w-16"
                  >
                    Regristasi
                  </Link>
                  .
                </p>
              </form>
            </div>
          </main>
        </div>
      </section>
    </>
  );
}
