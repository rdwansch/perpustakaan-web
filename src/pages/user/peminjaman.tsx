import Loader from '@/components/Loader';
import SideNav from '@/components/SideNav';
import SimpleAlert from '@/components/SimpleAlert';
import cookie from '@/lib/cookie';
import { getFullDate } from '@/lib/Date';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';

interface Buku {
  judul: string;
  cover: string;
  kode: string;
  kategori: string;
  tahun: string;
  penerbit: string;
}

interface Peminjaman {
  jumlah_buku: number;
  durasi: number;
  status: 'Menunggu Konfirmasi' | 'Dikonfirmasi';
  tanggal_pinjam: string;
  id: number;
  buku: {
    judul: string;
    cover: string;
  };
  user: {
    nama: string;
    username: string;
  };
}

export default function Peminjaman() {
  const [dataPeminjaman, setDataPeminjaman] = useState<Peminjaman[]>([]);
  const router = useRouter();

  const [selectedBuku, setSelectedBuku] = useState<Buku>();
  const [showModal, setShowModal] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertDetail, setAlertDetail] = useState('');
  const [alertHeading, setAlertHeading] = useState('');
  const [alertVariant, setAlertVariant] = useState<'SUCCESS' | 'DANGER'>('SUCCESS');

  // Form
  const [durasi, setDurasi] = useState('2');
  const [tanggalPinjam, setTanggalPinjam] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/peminjaman', {
      method: 'POST',
      headers: { Authorization: '' },
      body: JSON.stringify({ username, durasi, tanggal_pinjam: tanggalPinjam, kode: router.query.kode }),
    });
    router.push('/user/peminjaman');

    setShowModal(false);
    setShowAlert(true);
    if (response.ok) {
      setAlertVariant('SUCCESS');
      setAlertHeading('Berhasil meminjam Buku');
      setAlertDetail('Silahkan menunggu konfirmasi dari Pustakawan');
      return;
    }

    setAlertVariant('DANGER');
    setAlertHeading('Gagal meminjam Buku');
    setAlertDetail('');
  };

  useEffect(() => {
    const token = cookie.getItem('token');
    const payload = JSON.parse(atob(token.split('.')[1]));

    setUsername(payload.username);

    fetch(`/api/peminjaman?username=${username}`, { headers: { Authorization: cookie.getItem('token') } })
      .then(response => response.json())
      .then(result => setDataPeminjaman(result.data));
  }, [showModal]);

  useEffect(() => {
    if (router.query.kode) {
      setShowModal(true);
      fetch(`/api/databuku?kode=${router.query.kode}`, { headers: { Authorization: cookie.getItem('token') } })
        .then(response => response.json())
        .then(result => setSelectedBuku(result?.data[0]));
    }
  }, [router.query]);

  return (
    <>
      <Head>
        <title>Peminjaman</title>
      </Head>
      <SideNav />

      <div className="absolute top-0 left-80 w-[80%] pt-10 pl-10">
        <div className="flex justify-between">
          <h1 className="text-3xl text-gray-600">Peminjaman</h1>

          <button
            className="rounded-md bg-pink-100 px-5 py-2 text-primary transition hover:bg-pink-200"
            onClick={() => router.push('/')}
          >
            Pinjam Buku
          </button>
        </div>
        <br />
        <div className="flex flex-wrap gap-10">
          {dataPeminjaman.length > 0 ? (
            dataPeminjaman.map(dp => (
              <div
                key={dp.id}
                className={`flex w-[200px] flex-col justify-between overflow-hidden rounded-lg border shadow${
                  dp.status === 'Menunggu Konfirmasi'
                    ? 'border-gray-200 shadow-gray-200'
                    : 'border-green-500 shadow-green-500'
                } shadow-sm`}
              >
                <div>
                  <img
                    alt={dp.buku.judul}
                    src={dp.buku.cover ?? '/cover-placeholder.jpg'}
                    className="h-56 w-full object-cover"
                  />
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">{dp.buku.judul}</h3>
                    <p className="text-sm text-gray-500">Pinjam: {getFullDate(new Date(dp.tanggal_pinjam))}</p>
                    {dp.status === 'Dikonfirmasi' && (
                      <p className="text-sm text-gray-500">
                        Kembalikan sebelum:{' '}
                        {getFullDate(
                          new Date(
                            `${`${dp.tanggal_pinjam.slice(0, -16)}${new Date(dp.tanggal_pinjam).getDate() + durasi}`}`
                          )
                        )}{' '}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  {dp.status === 'Menunggu Konfirmasi' && (
                    <p className="px-5  py-1 text-center text-gray-700">{dp.status}</p>
                  )}
                  {dp.status === 'Dikonfirmasi' && <p className="px-5  py-1 text-center text-green-600">{dp.status}</p>}
                </div>

                <div>
                  {dp.status === 'Dikonfirmasi' && (
                    <button className="mx-auto mt-5 mb-4 block rounded bg-blue-600 px-5 py-1 text-white hover:bg-blue-700">
                      Kembalikan
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <Loader />
          )}
        </div>
      </div>

      <SimpleAlert
        variant={alertVariant}
        detail={alertDetail}
        heading={alertHeading}
        showAlert={showAlert}
        setShowAlert={setShowAlert}
      />

      {showModal && selectedBuku && (
        <>
          <div
            className="absolute right-0 left-0 bottom-0 top-0 h-[100vh] bg-[rgba(0,0,0,0.4)]"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="absolute top-0 left-0 right-0 z-10 mx-auto w-[700px] py-12">
            <div role="alert" className="container mx-auto w-11/12 max-w-full">
              <form onSubmit={handleSubmit}>
                <div className="relative rounded-lg border border-gray-400 bg-white py-8 px-5 shadow-md md:px-10">
                  <div className="mb-3 flex w-full justify-start text-gray-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-wallet"
                      width={52}
                      height={52}
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" />
                      <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
                    </svg>
                  </div>
                  <h1 className="font-lg mb-4 font-bold leading-tight tracking-normal text-gray-800">Pinjam Buku</h1>
                  <label htmlFor="name" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
                    Judul
                  </label>
                  <input
                    className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-pink-700 focus:outline-none"
                    value={selectedBuku?.judul}
                    disabled
                  />
                  <label htmlFor="name" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
                    Durasi
                  </label>
                  <select
                    className="mt-2 w-full rounded"
                    defaultValue={durasi}
                    value={durasi}
                    onChange={e => setDurasi(e.target.value)}
                  >
                    <option value="2">2 Hari</option>
                    <option value="3">3 Hari</option>
                    <option value="7">7 Hari</option>
                    <option value="14">14 Hari</option>
                  </select>
                  <label
                    htmlFor="tglPinjam"
                    className="mt-5 block text-sm font-bold leading-tight tracking-normal text-gray-800"
                  >
                    Tanggal Pinjam
                  </label>
                  <input type="date" id="tglPinjam" className="mt-2" onChange={e => setTanggalPinjam(e.target.value)} />

                  <div className="mt-5 flex w-full items-center justify-start">
                    <button
                      className="rounded bg-primary px-8 py-2 text-sm text-white transition duration-150 ease-in-out hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2"
                      type="submit"
                    >
                      Pinjam
                    </button>
                    <button
                      className="ml-3 rounded border  bg-gray-100 px-8 py-2 text-sm text-gray-600 transition duration-150 ease-in-out hover:border-gray-400 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
