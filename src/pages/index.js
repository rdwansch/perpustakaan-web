import { useContext } from 'react';
import { userContext } from '../lib/context';

export default function App() {
  const { state, dispatch } = useContext(userContext);

  return (
    <>
      <button
        className="mx-auto block rounded-full bg-red-100 px-2"
        onClick={() => dispatch({ type: 'LOGIN', payload: { nama: 'Ridhwan', alamat: 'Semarang', username: 'Username' } })}
      >
        Change State
      </button>
    </>
  );
}
