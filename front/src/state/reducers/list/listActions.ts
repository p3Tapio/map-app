import { Dispatch } from 'redux';
import axios from 'axios';
import {
  ListDispatchTypes, GETPUBLICLISTS, NewList, CREATELIST, GETUSERLISTS,
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
