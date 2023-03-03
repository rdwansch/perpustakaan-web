import Loader from '@/components/Loader';
import SideNav from '@/components/SideNav';
import SimpleAlert from '@/components/SimpleAlert';
import cookie from '@/lib/cookie';
import { getFullDate } from '@/lib/Date';
import Head from 'next/head';
import { FormEvent, useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

interface Pengembalian {
  status: string;
  tanggal_pinjam: Date;
  id: number;
  denda: number;
  tanggal_kembali: Date | string;
  buku: {
    judul: string;
    cover: string;
  };
  user: {
    nama: string;
    username: string;
  };
}

export default function Pengembalian() {
  const [isSSR, setIsSSR] = useState(false);
  const [dataPengembalian, setDataPengembalian] = useState<Array<Pengembalian>>([]);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState<'SUCCESS' | 'DANGER'>('SUCCESS');
  const [alertHeading, setAlertHeading] = useState('');
  const [alertDetail, setAlertDetail] = useState('');

  // Form
  const [id, setId] = useState(0);
  const [nama, setNama] = useState('');
  const [buku, setBuku] = useState('');
  const [tanggalPinjam, setTanggalPinjam] = useState('');
  const [denda, setDenda] = useState('');
  const [tanggalKembali, setTanggalKembali] = useState<Date | string>('');
  const [status, setStatus] = useState('Menunggu Konfirmasi');

  const columns: TableColumn<Pengembalian>[] = [
    { name: 'Nama', selector: row => row.user.nama },
    { name: 'Buku', selector: row => row.buku.judul },
    { name: 'Tanggal Pinjam', selector: row => `${getFullDate(new Date(row.tanggal_pinjam))}` },
    { name: 'Tanggal Kembali', selector: row => `${getFullDate(new Date(row.tanggal_kembali)) ?? <button>Belum</button>}` },
    { name: 'Denda', selector: row => `Rp. ${row.denda} ` },
    { name: 'Status', selector: row => row.status },
    {
      name: 'Action',
      cell: row => (
        <>
          <button
            className="inline-block bg-orange-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-orange-200 focus:relative"
            onClick={() => handleEditPengembalian(row)}
          >
            Edit
          </button>
          <button
            className="inline-block bg-red-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-200 focus:relative"
            onClick={() => confirm('Pengembalian akan dihapus') && handleHapusPengembalian(row.id)}
          >
            Hapus
          </button>
        </>
      ),
      width: '230px',
    },
  ];

  const handleHapusPengembalian = async (id: number) => {
    const response = await fetch('/api/pengembalian', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      setAlertVariant('DANGER');
      setAlertHeading(`Gagal HAPUS Peminjaman`);
      setAlertDetail('Peminjaman tidak ditemukan ');
      return;
    }

    setAlertVariant('SUCCESS');
    setAlertHeading(`Berhasil HAPUS Peminjaman`);
    setAlertDetail('');

    setDataPengembalian(prev => prev.filter(p => p.id != id));
  };

  const handleEditPengembalian = (row: Pengembalian) => {
    setShowModal(true);

    setId(row.id);
    setBuku(row.buku.judul);
    setTanggalPinjam(getFullDate(new Date(row.tanggal_pinjam)));
    setDenda(row.denda + '');
    setTanggalKembali(getFullDate(new Date(row.tanggal_kembali)));
    setNama(row.user.nama);
    setStatus(row.status);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/pengembalian', {
        method: 'PUT',
        body: JSON.stringify({
          status,
          id,
          denda,
        }),
      });
      const data = await response.json();

      setShowAlert(true);

      if (!response.ok) {
        setAlertVariant('DANGER');
        setAlertHeading(`Gagal EDIT Peminjaman`);
        setAlertDetail('Kode Peminjaman sudah ada');
        return;
      }

      setAlertVariant('SUCCESS');
      setAlertHeading(`Berhasil EDIT Peminjaman`);
      setAlertDetail('');

      setShowModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setIsSSR(false);
    fetch('/api/pengembalian', { headers: { Authorization: cookie.getItem('token') } })
      .then(response => response.json())
      .then(result => setDataPengembalian(result.data));
  }, [showModal]);

  return (
    <>
      <Head>
        <title>Pengembalian | Pustakawan</title>
      </Head>
      <SideNav />
      <div className="absolute top-0 left-80 w-[80%] pt-10 pl-10">
        <h1 className="text-3xl text-gray-600">Pengembalian</h1>
        <br />
        {!isSSR ? <DataTable data={dataPengembalian} columns={columns} pagination /> : <Loader />}
      </div>

      <SimpleAlert
        variant={alertVariant}
        detail={alertDetail}
        heading={alertHeading}
        showAlert={showAlert}
        setShowAlert={setShowAlert}
      />

      {showModal && (
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
                  <h1 className="font-lg mb-4 font-bold leading-tight tracking-normal text-gray-800">Data Pengembalian</h1>
                  <label htmlFor="name" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
                    Nama
                  </label>
                  <input
                    disabled
                    value={nama}
                    className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-pink-700 focus:outline-none"
                  />
                  <label htmlFor="name" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
                    Buku
                  </label>
                  <input
                    disabled
                    value={buku}
                    className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-pink-700 focus:outline-none"
                  />
                  <label htmlFor="name" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
                    Tanggal Pinjam
                  </label>
                  <input
                    disabled
                    value={tanggalPinjam}
                    className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-pink-700 focus:outline-none"
                  />
                  <label htmlFor="name" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
                    Tanggal Kembali
                  </label>
                  <input
                    disabled
                    value={tanggalKembali + ' '}
                    className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-pink-700 focus:outline-none"
                  />
                  <label htmlFor="name" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
                    denda
                  </label>
                  <input
                    value={denda}
                    onChange={e => setDenda(e.target.value)}
                    className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-pink-700 focus:outline-none"
                  />

                  <label htmlFor="name" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
                    Status
                  </label>
                  <select className="mt-2 w-full rounded" defaultValue={status} onChange={e => setStatus(e.target.value)}>
                    <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
                    <option value="Dikonfirmasi">Dikonfirmasi</option>
                    <option value="Terlambat">Terlambat</option>
                  </select>

                  <div className="mt-5 flex w-full items-center justify-start">
                    <button
                      className="rounded bg-primary px-8 py-2 text-sm text-white transition duration-150 ease-in-out hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2"
                      type="submit"
                    >
                      Simpan
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

// Jika peminjaman "Dikonfirmasi" maka create table pengembalian
// Jika pengembalian "Selesai" maka change status pengembalian & delete peminjaman
