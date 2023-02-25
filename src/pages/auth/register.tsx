import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';

export default function Login() {
  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [nomor_telepon, setNoTelp] = useState('');
  const [alamat, setAlamat] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const [registerAlert, setRegisterAlert] = useState('');

  const router = useRouter();

  useEffect(() => {
    if (password !== confirmPassword) {
      return setIsWrongPassword(true);
    }

    setIsWrongPassword(false);
  }, [password, confirmPassword]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    fetch('/api/auth', {
      method: 'POST',
      headers: {
        type: 'REGISTER',
      },
      body: JSON.stringify({
        nama,
        username,
        nomor_telepon,
        alamat,
        password,
      }),
    }).then(async response => {
      if (!response.ok) {
        const { message } = await response.json();
        return setRegisterAlert(message);
      }

      // redirect
      router.push('/');
    });
  };

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="-translate-y-[170px]">
        <path
          fill="#e7008a"
          fillOpacity={1}
          d="M0,192L34.3,176C68.6,160,137,128,206,112C274.3,96,343,96,411,133.3C480,171,549,245,617,256C685.7,267,754,213,823,197.3C891.4,181,960,203,1029,208C1097.1,213,1166,203,1234,186.7C1302.9,171,1371,149,1406,138.7L1440,128L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"
        />
      </svg>

      <div className="mx-auto -mt-52 max-w-xl rounded-lg border border-[#ff56bb] px-5 py-10">
        <h1 className="text-center text-2xl font-bold tracking-wide">Regristasi Akun </h1>
        <br />
        <hr />
        <div className="col-span-12 text-center text-red-500">{registerAlert}</div>
        <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-6 gap-6">
          <div className="col-span-6 sm:col-span-3">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nama
            </label>
            <input
              type="text"
              id="name"
              className="basic-input border-gray-200"
              value={nama}
              onChange={e => setNama(e.target.value)}
            />
          </div>
          <div className="col-span-6 sm:col-span-3">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="basic-input border-gray-200"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="col-span-6">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Nomor Telepon
            </label>
            <input
              type="tel"
              id="phone"
              className="basic-input border-gray-200"
              value={nomor_telepon}
              onChange={e => {
                const val = e.target.value;
                if (val == '') {
                  setNoTelp(val);
                }
                if (/^[0-9]+$/.test(val)) {
                  setNoTelp(val);
                }
              }}
            />
          </div>
          <div className="col-span-6">
            <label htmlFor="Addrs" className="block text-sm font-medium text-gray-700">
              Alamat
            </label>
            <input
              type="text"
              id="Addrs"
              className="basic-input border-gray-200"
              value={alamat}
              onChange={e => setAlamat(e.target.value)}
            />
          </div>
          <div className="col-span-6 sm:col-span-3">
            <label
              htmlFor="Password"
              className={`block text-sm font-medium  ${isWrongPassword ? 'animate-pulse text-red-500' : 'text-gray-700'}`}
            >
              Password
            </label>
            <input
              type="password"
              id="Password"
              name="password"
              className={`basic-input  ${isWrongPassword ? 'animate-pulse border-red-500' : 'border-gray-200 '}`}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="col-span-6 sm:col-span-3">
            <label
              htmlFor="PasswordConfirmation"
              className={`block text-sm font-medium  ${isWrongPassword ? 'animate-pulse text-red-500' : 'text-gray-700'}`}
            >
              Password Confirmation
            </label>
            <input
              type="password"
              id="PasswordConfirmation"
              name="password_confirmation"
              className={`basic-input  ${isWrongPassword ? 'animate-pulse border-red-500' : 'border-gray-200 '}`}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>
          {isWrongPassword && (
            <div className="col-span-full -my-3 ml-auto w-fit animate-pulse rounded-full bg-red-100 px-2 text-sm text-red-500">
              Password tidak cocok
            </div>
          )}
          <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
            <button className="inline-block shrink-0 rounded-md border border-primary bg-primary px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-primary focus:bg-[#ffffff] focus:text-primary focus:outline-none focus:ring focus:ring-[#ffaadd]">
              Buat Akun
            </button>
            <p className="mt-4 text-sm text-gray-500 sm:mt-0">
              Sudah pernah membuat? &nbsp;
              <Link
                href="/auth/login"
                className="relative text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:w-0 after:rounded-full after:bg-gradient-to-r after:from-primary after:to-[#ff44b4] after:transition-[width] after:content-[''] after:hover:w-10"
              >
                Log in
              </Link>
              .
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
