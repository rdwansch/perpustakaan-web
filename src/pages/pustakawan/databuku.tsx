import Loader from '@/components/Loader';
import SideNav from '@/components/SideNav';
import SimpleAlert from '@/components/SimpleAlert';
import cookie from '@/lib/cookie';
import { prisma } from '@/prisma/config';
import { GetServerSideProps } from 'next';
import { FormEvent, useEffect, useReducer, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

interface Buku {
  judul: string;
  cover: string;
  kode: string;
  kategori: string;
  tahun: string;
  penerbit: string;
}

// interface Props {
//   data: Buku[];
//   err?: string;
// }

export default function Databuku() {
  const [dataBuku, setData] = useState<Buku[]>([]);
  const [isSSR, setIsSSR] = useState(true);

  const [showAlert, setShowAlert] = useState(false);
  const [alertDetail, setAlertDetail] = useState('');
  const [alertHeading, setAlertHeading] = useState('');
  const [alertVariant, setAlertVariant] = useState<'SUCCESS' | 'DANGER'>('SUCCESS');

  const [showModal, setShowModal] = useState(false);

  // Input form
  const [judulFrm, setJudulFrm] = useState('');
  const [kategoriFrm, setKategoriFrm] = useState('');
  const [tahunFrm, setTahunFrm] = useState('');
  const [penerbitFrm, setPenerbitFrm] = useState('');
  const [kodeFrm, setKodeFrm] = useState('');
  const [coverFrm, setCoverFrm] = useState<string | Blob>('');

  const columns: TableColumn<Buku>[] = [
    { name: 'Judul', selector: row => row.judul },
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
          <button
            className="inline-block bg-red-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-200 focus:relative"
            onClick={() => confirm(`Buku ${row.judul}-${row.tahun} akan terhapus`) && handleBtnAction('DELETE', row.kode)}
          >
            Hapus
          </button>
        </>
      ),
      width: '230px',
    },
  ];

  const handleBtnAction = async (act: 'DELETE' | 'DETAIL' | 'EDIT', kode: string) => {
    switch (act) {
      case 'DELETE': {
        const response = await fetch('/api/databuku', {
          method: 'DELETE',
          credentials: 'include',
          body: JSON.stringify({ kode }),
        });

        const data = await response.json();

        if (!response.ok) {
          alert('Gagal menghapus Buku');
          return;
        }
        setShowAlert(true);
        setAlertHeading('Sukses menghapus buku');
        setAlertDetail('');
        setData(prev => prev.filter(buku => buku.kode != kode));
      }
    }
  };

  const handleTambahForm = async (e: FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append('judul', judulFrm);
    form.append('cover', coverFrm);
    form.append('tahun', tahunFrm);
    form.append('penerbit', penerbitFrm);
    form.append('kategori', kategoriFrm);
    form.append('kode', kodeFrm);
    form.append('jumlah', '50');

    const response = await fetch('/api/uploadbuku', { method: 'POST', body: form });
    setShowAlert(true);

    if (!response.ok) {
      setAlertVariant('DANGER');
      setAlertHeading('Gagal menambah Buku');
      setAlertDetail('Kode Buku sudah ada');
      return;
    }

    setAlertVariant('SUCCESS');
    setAlertHeading('Berhasil Menambah Buku');
    setShowModal(false);
  };

  useEffect(() => {
    setIsSSR(false);
    fetch('/api/databuku', { headers: { Authorization: cookie.getItem('token') } })
      .then(response => response.json())
      .then(result => setData(result.data));
  }, []);

  return (
    <>
      <SideNav />
      <div className="absolute top-0 left-80 w-[80%] pt-10 pl-10">
        <div className="flex justify-between">
          <h1 className="text-3xl text-gray-600">Data Buku</h1>
          <button
            className="rounded-md bg-pink-100 px-5 py-2 text-primary transition hover:bg-pink-200"
            onClick={() => setShowModal(true)}
          >
            Tambah Buku
          </button>
        </div>

        {!isSSR ? <DataTable data={dataBuku} columns={columns} pagination /> : <Loader />}

        {/* <table className="mt-10 w-full divide-y-2 divide-gray-200 text-sm shadow">
          <thead>
            <tr>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">No</th>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Judul</th>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Cover</th>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Kategori</th>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Tahun</th>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Penerbit</th>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Kode</th>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Aksi</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className=" divide-y divide-gray-200">
            {dataBuku &&
              dataBuku.map((buku, idx) => (
                <tr className="even:bg-gray-50" key={buku.kode}>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{idx + 1}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{buku.judul}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    <img src={buku.cover} alt={'Thumbnail'} width={50} height={20} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{buku.kategori}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{buku.tahun}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{buku.penerbit}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{buku.kode}</td>
                  <td className="whitespace-nowrap px-4 py-2">
                    <span className="inline-flex -space-x-px overflow-hidden rounded-md border bg-white shadow-sm">
                      <button className="inline-block bg-violet-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-violet-200 focus:relative">
                        Detail
                      </button>
                      <button className="inline-block bg-orange-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-orange-200 focus:relative">
                        Edit
                      </button>
                      <button
                        className="inline-block bg-red-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-200 focus:relative"
                        onClick={() =>
                          confirm(`Buku ${buku.judul}-${buku.tahun} akan terhapus`) && handleBtnAction('DELETE', buku.kode)
                        }
                      >
                        Hapus
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table> */}
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
              <form onSubmit={handleTambahForm}>
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
                  <h1 className="font-lg mb-4 font-bold leading-tight tracking-normal text-gray-800">Tambah Data Buku</h1>
                  <label htmlFor="name" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
                    Judul
                  </label>
                  <input
                    className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-pink-700 focus:outline-none"
                    placeholder="The book"
                    onChange={e => setJudulFrm(e.target.value)}
                  />
                  <label htmlFor="name" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
                    Kategori
                  </label>
                  <input
                    className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-pink-700 focus:outline-none"
                    placeholder="Novel"
                    onChange={e => setKategoriFrm(e.target.value)}
                  />
                  <label htmlFor="name" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
                    Tahun
                  </label>
                  <input
                    className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-pink-700 focus:outline-none"
                    placeholder="0000"
                    onChange={e => {
                      const val = e.target.value;
                      if (val == '') {
                        setTahunFrm(val);
                      }
                      if (/^[0-9]+$/.test(val) && val.length <= 4) {
                        setTahunFrm(val);
                      }
                    }}
                    value={tahunFrm}
                  />
                  <label htmlFor="name" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
                    Penerbit
                  </label>
                  <input
                    className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-pink-700 focus:outline-none"
                    placeholder="media"
                    onChange={e => setPenerbitFrm(e.target.value)}
                  />
                  <label htmlFor="name" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
                    Kode
                  </label>
                  <input
                    className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-pink-700 focus:outline-none"
                    placeholder="KO/0/1"
                    onChange={e => setKodeFrm(e.target.value)}
                  />
                  <label htmlFor="name" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
                    Cover
                  </label>
                  <input
                    className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-pink-700 focus:outline-none"
                    type="file"
                    onChange={e => {
                      if (!e.target.files) return;
                      setCoverFrm(e.target.files[0]);
                    }}
                  />
                  <div className="flex w-full items-center justify-start">
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

// export const getServerSideProps: GetServerSideProps = async ctx => {
//   return prisma.buku
//     .findMany({
//       select: {
//         judul: true,
//         cover: true,
//         kode: true,
//         kategori: true,
//         tahun: true,
//         penerbit: true,
//       },
//       orderBy: {
//         id: 'desc',
//       },
//     })
//     .then(buku => ({
//       props: {
//         data: buku,
//       },
//     }))
//     .catch(err => ({
//       props: {
//         d_: [],
//         err: err.message,
//       },
//     }));
// };
