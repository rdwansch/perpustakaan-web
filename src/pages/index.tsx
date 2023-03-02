import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Buku {
  judul: string;
  cover: string;
  jumlah: string;
  kategori: string;
  kode: string;
  sinopsis: string;
  penerbit: string;
  tahun: string;
}

export default function Index() {
  const [data, setData] = useState<Array<Buku>>([]);
  const [queryBuku, setQueryBuku] = useState('');
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    if (skip < 0) {
      setSkip(0);
    }

    fetch(`/api/databuku?judul=${queryBuku}`)
      .then(response => response.json())
      .then(result => setData(result.data))
      .catch(err => console.log(err));
  }, [queryBuku]);

  return (
    <>
      <Navbar />

      <div className="container mx-auto mt-14">
        <h1 className="text-center text-5xl font-normal">Perpustakaan</h1>

        <div className="mx-auto mt-10 max-w-md">
          <div className="relative flex h-12 w-full items-center overflow-hidden rounded-lg bg-white shadow-lg">
            <div className="grid h-full w-12 place-items-center text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              onChange={e => setQueryBuku(e.target.value)}
              value={queryBuku}
              className="w-11/12 border-none pr-5 focus:border-none focus:ring-0"
              placeholder="Cari buku"
            />
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-10">
          {data.length > 0
            ? data.map(buku => (
                <div key={buku.kode} className="w-[250px] overflow-hidden rounded-lg border border-gray-100 shadow-sm">
                  <img alt="Office" src={buku.cover ?? '/cover-placeholder.jpg'} className="h-56 w-full object-cover" />
                  <div className="p-4 sm:p-6">
                    <a href="#">
                      <h3 className="text-lg font-medium text-gray-900">{buku.judul}</h3>
                    </a>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-3">
                      {buku.sinopsis || 'Buku ini sangatlah bagus'}
                    </p>
                    <Link
                      href={`/databuku/${buku.kode.replaceAll('/', '%2f')}`}
                      className="group mt-4 inline-flex items-center gap-1 text-sm font-medium text-pink-600"
                    >
                      Lihat Detail
                      <span aria-hidden="true" className="block transition group-hover:translate-x-0.5">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              ))
            : 'Tidak Ada Buku'}
        </div>
        <div className="mx-auto mt-10 flex w-fit justify-center gap-3">
          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded border border-pink-100 hover:shadow hover:shadow-pink-300"
            onClick={() => setSkip(prev => prev + 18)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded border border-pink-100 hover:shadow hover:shadow-pink-300"
            onClick={() => setSkip(prev => prev - 18)}
          >
            <span className="sr-only">Next Page</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
}
