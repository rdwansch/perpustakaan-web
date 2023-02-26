import { InitialState } from './context';

export const userReducer = (state: InitialState, action: { type: 'LOGIN' | 'LOGOUT'; payload: InitialState }) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, ...action.payload };

    default:
      return state;
  }
};
