import { Dispatch } from 'redux';
import axios from 'axios';
import {
  ListDispatchTypes, GETPUBLICLISTS, NewList, CREATELIST, GETUSERLISTS, DELETELIST, List, UPDATELIST,
} from './listTypes';
import { createConfig } from '../../localStore';

const baseUrl = process.env.REACT_APP_URL;

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
export const createNewList = (list: NewList) => async (dispatch: Dispatch<ListDispatchTypes>): Promise<void> => {
  const config = createConfig();
  if (config.headers.token) {
    const res = await axios.post(`${baseUrl}/api/list/create`, list, config);
    const { data } = res;
    dispatch({
      type: CREATELIST,
      payload: data,
    });
  }
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
