import { Dispatch } from 'redux';
import axios from 'axios';
import {
  LoggedUser, LOGIN, REGISTER, SigningUser, UserDispatchTypes,
} from './userTypes';

const baseUrl = process.env.REACT_APP_URL;

export const registerUser = (newUser: SigningUser) => async (dispatch: Dispatch<UserDispatchTypes>): Promise<void> => {
  const registeredUser: LoggedUser = await axios.post(`${baseUrl}/api/user/register/`, newUser);
  window.localStorage.setItem('loggedUser', JSON.stringify(registeredUser.data));
  dispatch({
    type: REGISTER,
    payload: registeredUser,
  });
};
export const loginUser = (user: SigningUser) => async (dispatch: Dispatch<UserDispatchTypes>): Promise<void> => {
  const loggedUser: LoggedUser = await axios.post(`${baseUrl}/api/user/login/`, user);
  window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser.data))
  dispatch({
    type: LOGIN,
    payload: loggedUser,
  })
}