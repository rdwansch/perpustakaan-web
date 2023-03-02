import SideNav from '@/components/SideNav';
import { getFullDate } from '@/lib/Date';
import { prisma } from '@/prisma/config';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

interface Props {
  databuku: number;
  pengguna: number;
  peminjam: number;
}

export default function Index({ databuku, pengguna, peminjam }: Props) {
  return (
    <div>
      <Head>
        <title>Pustakawan</title>
      </Head>
      <SideNav />

      <div className="absolute top-0 left-80 w-[80%] pt-10 pl-10">
        <h1 className="text-3xl text-gray-600">Dashboard</h1>
        <div className="mt-10 flex w-full gap-20">
          <div className="w-full rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-sm transition hover:shadow-lg">
            <div className="rounded-[10px] bg-white p-4 pl-10 sm:p-6">
              <time dateTime="2022-10-10" className="block text-xs text-gray-500">
                {getFullDate(new Date())}
              </time>
              <h2 className="mt-0.5 text-lg font-medium text-gray-900">Data Buku</h2>
              <h3 className="text-3xl font-bold sm:text-4xl">{databuku}+</h3>
            </div>
          </div>
          <div className="w-full rounded-xl bg-gradient-to-r from-violet-300 via-yellow-500 to-primary p-0.5 shadow-sm transition hover:shadow-lg">
            <div className="rounded-[10px] bg-white p-4 pl-10 sm:p-6">
              <time dateTime="2022-10-10" className="block text-xs text-gray-500">
                {getFullDate(new Date())}
              </time>
              <h2 className="mt-0.5 text-lg font-medium text-gray-900">Pengguna</h2>
              <h3 className="text-3xl font-bold sm:text-4xl">{pengguna}+</h3>
            </div>
          </div>
          <div className="w-full rounded-xl bg-gradient-to-r from-zinc-300 via-sky-500 to-primary p-0.5 shadow-sm transition hover:shadow-lg">
            <div className="rounded-[10px] bg-white p-4 pl-10 sm:p-6">
              <time dateTime="2022-10-10" className="block text-xs text-gray-500">
                {getFullDate(new Date())}
              </time>
              <h2 className="mt-0.5 text-lg font-medium text-gray-900">Peminjaman</h2>
              <h3 className="text-3xl font-bold sm:text-4xl">{peminjam}+</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const databuku = (await prisma.buku.count()) - 1;
  const pengguna = (await prisma.user.count()) - 1;
  const peminjam = (await prisma.peminjaman.count()) - 1;

  return {
    props: {
      databuku,
      pengguna,
      peminjam,
    },
  };
};
