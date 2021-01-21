/* eslint-disable no-console */
import { Dispatch } from 'redux';
import axios from 'axios';
import {
  LocationDispatchTypes, GETLOCATIONS, NewLocation, CREATELOCATION, CreateLocation, GETUSERLOCATIONS,
} from './locationTypes';
import { getToken } from '../../localStore';

const baseUrl = process.env.REACT_APP_URL;
const token = getToken();
const config = { headers: { token } };

export const getAllLocations = () => async (dispatch: Dispatch<LocationDispatchTypes>): Promise<void> => {
  const res = await axios.get(`${baseUrl}/api/location/all`);
  const { data } = res;
  dispatch({
    type: GETLOCATIONS,
    payload: data,
  });
};
export const getUserLocations = () => async (dispatch: Dispatch<LocationDispatchTypes>): Promise<void> => {
  if (config.headers.token) {
    const res = await axios.get(`${baseUrl}/api/location/user`, config);
    const { data } = res;
    dispatch({
      type: GETUSERLOCATIONS,
      payload: data,
    });
  }
};
export const createNewLocation = (location: NewLocation) => async (dispatch: Dispatch<CreateLocation>): Promise<void> => {
  if (config.headers.token) {
    const res = await axios.post(`${baseUrl}/api/location/create`, location, config);
    const { data } = res;
    dispatch({
      type: CREATELOCATION,
      payload: data,
    });
  }
};
