import { Dispatch } from 'redux';
import axios from 'axios';
import {
  LOGIN, REGISTER, SigningUser, UserDispatchTypes,
} from './userTypes';
import { setUser } from '../../localStore';

const baseUrl = process.env.APP_URL;

export const registerUser = (newUser: SigningUser) => async (dispatch: Dispatch<UserDispatchTypes>): Promise<void> => {
  const res = await axios.post(`${baseUrl}/api/user/register/`, newUser);
  const { data } = res;
  setUser(data);
  dispatch({
    type: REGISTER,
    payload: data,
  });
};
export const loginUser = (user: SigningUser) => async (dispatch: Dispatch<UserDispatchTypes>): Promise<void> => {
  const res = await axios.post(`${baseUrl}/api/user/login/`, user);
  const { data } = res;
  setUser(data);
  dispatch({
    type: LOGIN,
    payload: data,
  });
};
