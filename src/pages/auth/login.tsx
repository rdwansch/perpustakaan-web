import { FormEvent, useState } from 'react';
import { GetServerSideProps } from 'next';

import Head from 'next/head';
import Link from 'next/link';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

// import required modules
import { EffectCoverflow } from 'swiper';
import { prisma } from '@/prisma/config';
import { useRouter } from 'next/router';

interface Props {
  data: [{ cover: string; judul: string; kode: string }];
}

export default function Login({ data }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginAlert, setLoginAlert] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          type: 'LOGIN',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log(response.ok);

      if (!response.ok) {
        const { message } = await response.json();
        setLoginAlert(message);
        return;
      }
      alert('sukses');
      // router.push()
    } catch (err) {}
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>

      <section className="bg-white">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          <section className="relative -mt-[80px] flex flex-col items-center justify-center gap-20 lg:col-span-5 lg:h-full xl:col-span-6">
            <div className="absolute h-[100%] w-[100%] translate-y-[150px] overflow-y-hidden bg-[url(/login_wave.svg)] bg-cover"></div>

            <h1 className="z-[1] text-3xl font-bold">Perpustakaan Snapan</h1>

            <Swiper
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={false}
              slidesPerView={'auto'}
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              modules={[EffectCoverflow]}
              className="mySwiper z-[1]"
            >
              {data.map(book => (
                <SwiperSlide key={book.kode}>
                  <img src={book.cover + ''} title={book.judul} />
                </SwiperSlide>
              ))}
            </Swiper>
          </section>

          <main
            aria-label="Main"
            className="flex items-center justify-center  px-8 py-8 sm:px-12 lg:col-span-7 lg:py-12 lg:px-16 xl:col-span-6"
          >
            <div className="w-8/12 max-w-xl rounded-lg border border-[#ff56bb] px-5 py-10 lg:max-w-3xl">
              <form onSubmit={handleSubmit}>
                <h3 className="text-center text-2xl font-bold">Login</h3>
                <p className="mt-5 text-right text-red-500">{loginAlert}</p>
                <div className="mb-5">
                  <label htmlFor="username" className="block font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    onChange={e => setUsername(e.target.value)}
                    value={username}
                    className="basic-input border-gray-200"
                  />
                </div>
                <div className="mb-5">
                  <label htmlFor="passwd" className="block font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    id="passwd"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    className="basic-input border-gray-200"
                  />
                </div>

                <button className="inline-block shrink-0 rounded-md border border-primary bg-primary px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-primary focus:bg-[#ffffff] focus:text-primary focus:outline-none focus:ring focus:ring-[#ffaadd]">
                  Masuk
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

export const getServerSideProps: GetServerSideProps = async ctx => {
  const buku = await prisma.buku.findMany({
    select: {
      cover: true,
      judul: true,
      kode: true,
    },
    where: {
      cover: {
        not: null,
      },
    },
    take: 10,
  });

  return {
    props: {
      data: buku,
    },
  };
};
