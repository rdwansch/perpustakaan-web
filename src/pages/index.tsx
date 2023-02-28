import { useContext } from 'react';
import { userContext } from '@/lib/context';

export default function App() {
  const { state, dispatch } = useContext(userContext);

  // console.log(cookie.getItem('token'));

  return (
    <>
      <button
        className="mx-auto block rounded-full bg-red-100 px-2"
        onClick={() =>
          dispatch({
            type: 'LOGOUT',
            payload: { nama: 'Ridhwan', alamat: 'Semarang', username: 'Username', nomor_telepon: '081227428921' },
          })
        }
      >
        Change State
      </button>
    </>
  );
}
