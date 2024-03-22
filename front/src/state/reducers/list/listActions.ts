import { Dispatch } from 'redux';
import axios from 'axios';
import {
  ListDispatchTypes, GETPUBLICLISTS, NewList, CREATELIST, GETUSERLISTS, DELETELIST, List, UPDATELIST, TOGGLEFAVORITE,
} from './listTypes';
import { createConfig, getUser, setUser } from '../../localStore';

const baseUrl = process.env.APP_URL;

export const getPublicLists = () => async (dispatch: Dispatch<ListDispatchTypes>): Promise<void> => {
  const res = await axios.get(`${baseUrl}/api/list/allpublic`);
  const { data } = res;
  dispatch({
    type: GETPUBLICLISTS,
    payload: data,
  });
};
export const getUserLists = () => async (dispatch: Dispatch<ListDispatchTypes>): Promise<void> => {
  const config = createConfig();
  if (config.headers.token) {
    const res = await axios.get(`${baseUrl}/api/list/user`, config);
    const { data } = res;
    dispatch({
      type: GETUSERLISTS,
      payload: data,
    });
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createNewList = (list: NewList): any => {
  const config = createConfig();
  if (config.headers.token) {
    return async (dispatch: Dispatch<ListDispatchTypes>): Promise<List> => axios.post(`${baseUrl}/api/list/create`, list, config).then((res) => {
      const { data } = res;
      dispatch({ type: CREATELIST, payload: data });
      return data;
    });
  }
  return null;
};
export const updateList = (list: List) => async (dispatch: Dispatch<ListDispatchTypes>): Promise<void> => {
  const config = createConfig();
  if (config.headers.token) {
    const res = await axios.put(`${baseUrl}/api/list/update/${list._id}`, list, config);
    const { data } = res;
    dispatch({
      type: UPDATELIST,
      payload: data,
    });
  }
};
export const deleteList = (id: string) => async (dispatch: Dispatch<ListDispatchTypes>): Promise<void> => {
  const config = createConfig();
  if (config.headers.token) {
    await axios.delete(`${baseUrl}/api/list/delete/${id}`, config);
    dispatch({
      type: DELETELIST,
      payload: id,
    });
  }
};
export const toggleFavorite = (id: string) => async (dispatch: Dispatch<ListDispatchTypes>): Promise<void> => {
  const config = createConfig();
  if (config.headers.token) {
    const res = await axios.post(`${baseUrl}/api/list/favorite/${id}`, {}, config);
    const { data } = res;
    const user = getUser();
    user.favorites = user.favorites.includes(data._id)
      ? user.favorites.filter((y) => y !== data._id)
      : user.favorites.concat(data._id);
    setUser(user);
    dispatch({
      type: TOGGLEFAVORITE,
      payload: data,
    });
  }
};
