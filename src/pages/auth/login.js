import Link from 'next/link';

export default function login() {
  return (
    <div className="flex justify-center items-center h-[100vh]">
      <div className="bg-violet-900 w-[400px] h-[400px] rounded-lg p-5">
        <h1 className="text-center text-white text-4xl my-[50px]">Perpustakaan</h1>
        <div className="flex flex-col gap-5">
          <input type="text" className="px-5 py-2 rounded" placeholder="username" />
          <input type="password" className="px-5 py-2 rounded" placeholder="password" />

          <button className="px-5 py-2 bg-violet-200 w-1/3 block mx-auto rounded hover:bg-violet-400">Masuk</button>

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
      </div>
    </div>
  );
}
