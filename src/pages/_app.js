import '@/styles/globals.css';
import { useReducer } from 'react';
import { userReducer } from '../lib/reducer';
import { initialState, userContext } from '../lib/context';

export default function App({ Component, pageProps }) {
  const [state, dispatch] = useReducer(userReducer, initialState);
  return (
    <userContext.Provider value={{ state, dispatch }}>
      <Component {...pageProps} />
    </userContext.Provider>
  );
}
