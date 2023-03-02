import Loader from '@/components/Loader';
import SideNav from '@/components/SideNav';
import cookie from '@/lib/cookie';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

interface Buku {
  judul: string;
  cover: string;
  kode: string;
  kategori: string;
  tahun: string;
  penerbit: string;
}

export default function Peminjaman() {
  const [isSSR, setIsSSR] = useState(true);
  const [dataBuku, setData] = useState<Buku[]>([]);

  const columns: TableColumn<Buku>[] = [
    { name: 'Judul', selector: row => row.judul },
    {
      name: 'cover',
      cell: row => (
        <Image
          src={row.cover ?? '/cover-placeholder.png'}
          alt={row.judul}
          width={100}
          height={150}
          style={{ width: '50px', height: '70px', objectFit: 'cover' }}
        />
      ),
    },
    { name: 'Kategori', selector: row => row.kategori },
    { name: 'Tahun', selector: row => row.tahun },
    { name: 'Penerbit', selector: row => row.penerbit },
    { name: 'Kode', selector: row => row.kode },
    {
      name: 'Action',
      cell: row => (
        <>
          <button className="inline-block bg-violet-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-violet-200 focus:relative">
            Detail
          </button>
          <button className="inline-block bg-orange-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-orange-200 focus:relative">
            Edit
          </button>
          <button className="inline-block bg-red-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-200 focus:relative">
            Hapus
          </button>
        </>
      ),
      width: '230px',
    },
  ];

  useEffect(() => {
    setIsSSR(false);
    fetch('/api/peminjaman', { headers: { Authorization: cookie.getItem('token') } })
      .then(response => response.text())
      .then(result => {
        console.log(result);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Peminjaman</title>
      </Head>
      <SideNav />
      <div className="absolute top-0 left-80 w-[80%] pt-10 pl-10">
        <h1 className="text-3xl text-gray-600">Peminjaman</h1>

        <br />
        {/* {!isSSR ? <DataTable data={dataBuku} columns={columns} pagination /> : <Loader />} */}
      </div>
    </>
  );
}
