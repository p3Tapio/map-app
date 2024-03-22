import axios from 'axios';
import { createConfig } from '../localStore';
import { NewLocation, Location } from './locationTypes';

const baseUrl = process.env.APP_URL;

// TODO return & errors ?????
const createNewLocation = async (location: NewLocation): Promise<void> => {
  const config = createConfig();
  if (config.headers.token) await axios.post(`${baseUrl}/api/location/create`, location, config);
};
const updateLocation = async (location: Location): Promise<void> => {
  const config = createConfig();
  if (config.headers.token) await axios.put(`${baseUrl}/api/location/update/${location._id}`, location, config);
};
const deleteLocation = async (id: string): Promise<void> => {
  const config = createConfig();
  if (config.headers.token) await axios.delete(`${baseUrl}/api/location/delete/${id}`, config);
};

export default { createNewLocation, updateLocation, deleteLocation };
