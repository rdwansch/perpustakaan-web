import Link from 'next/link';
import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();

    if (username.length < 3 && password.length < 3) {
      alert('Username/ Password min 4 karakter');
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth`, {
      method: 'POST',
      headers: {
        type: 'LOGIN',
      },
      body: {
        username: username,
        password: password,
      },
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="flex justify-center items-center h-[100vh]">
      <div className="bg-violet-900 w-[400px] h-[400px] rounded-lg p-5">
        <form onSubmit={handleSubmit}>
          <h1 className="text-center text-white text-4xl my-[50px]">Perpustakaan</h1>
          <div className="flex flex-col gap-5">
            <input
              type="text"
              className="px-5 py-2 rounded"
              placeholder="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <input
              type="password"
              className="px-5 py-2 rounded"
              placeholder="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <button type="submit" className="px-5 py-2 bg-violet-200 w-1/3 block mx-auto rounded hover:bg-violet-400">
              Masuk
            </button>

            <p className="text-gray-200">
              Belum punya akun ?{' '}
              <Link
                href="/auth/register"
                className={
                  'hover:text-white relative after:transition-[width] ' +
                  'after:absolute after:content[""] after:left-0 after:right-0 after:w-0 after:bottom-0 after:h-0.5 after:bg-white  ' +
                  'after:hover:w-14'
                }
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
