import { UserValidate } from '@/prisma/validate';
import { createContext } from 'react';
import { userReducer } from './reducer';

export interface InitialState {
  nama: string;
  username: string;
  alamat: string;
  nomor_telepon: string;
}

export const initialState = {
  nama: '',
  username: '',
  alamat: '',
  nomor_telepon: '',
};

export const userContext = createContext<{
  state: InitialState;
  dispatch: React.Dispatch<{ type: 'LOGIN' | 'LOGOUT'; payload: InitialState }>;
}>({
  state: initialState,
  dispatch: () => null,
});
