import Loader from '@/components/Loader';
import Navbar from '@/components/Navbar';
import cookie from '@/lib/cookie';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface Books {
  kode: string;
  judul: string;
  cover: string | null;
  sinopsis: string | null;
  tahun: number;
  penerbit: string;
  kategori: string;
  jumlah: number;
}

export default function Kode() {
  const router = useRouter();
  const { kode } = router.query;
  const [data, setData] = useState<Books>();
  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    fetch(`/api/databuku?kode=${kode}&judul=${''}`)
      .then(response => response.json())
      .then(result => setData(result.data[0]))
      .catch(err => console.log(err));
  }, [kode]);

  useEffect(() => {
    const token = cookie.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setRole(payload.role);
      setIsLogin(true);
    }
  }, []);

  console.log(data);

  return (
    <>
      <Navbar />

      <div className="container mx-auto mt-10">
        {data ? (
          <div className="mx-auto flex w-9/12 gap-10 rounded border p-10 shadow-lg">
            <img src={data.cover ?? '/cover-placeholder.jpg'} alt={data.judul} width={250} height={400} />
            <div className="flex flex-col justify-between gap-5">
              <div>
                <h1 className="text-2xl font-medium">{data.judul}</h1>
                <p className="text-gray-600">
                  Penerbit: <span className="font-semibold">{data.penerbit}</span>
                </p>
                <p className="text-gray-600">
                  Tahun: <span className="font-semibold">{data.tahun}</span>
                </p>
                <p className="text-gray-600">
                  Kategori: <span className="font-semibold">{data.kategori}</span>
                </p>
                <br />
                <p className="text-gray-500">{data.sinopsis}</p>
              </div>
              <button
                className="block w-fit rounded-lg border border-primary px-10 py-2 shadow shadow-pink-200 transition hover:bg-primary hover:text-white hover:shadow-xl"
                onClick={() => {
                  if (isLogin) {
                    role == 'pustakawan'
                      ? router.push('/')
                      : router.push({ pathname: '/user/peminjaman', query: `kode=${data.kode}` });
                  }
                }}
              >
                {role == 'pustakawan' ? 'Kembali' : 'Pinjam'}
              </button>
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
}
