import axios from "axios";
import { createConfig } from "../localStore";

const baseUrl = process.env.APP_URL;
const mapBoxUrl = `${baseUrl}/api/externals/mapbox`;

const getAddress = async (
  lat: number,
  lng: number
): Promise<{ data: { features: any[] } } | undefined> => {
  const config = createConfig();
  if (!config.headers.token) return undefined;
  return axios.get(`${mapBoxUrl}/address/?lat=${lat}&lng=${lng}`, config);
};

const getCoordinates = async (
  address: string
): Promise<
  { data: { coordinates: { lat: number; lng: number } } } | undefined
> => {
  const config = createConfig();
  if (!config.headers.token) return undefined;
  return axios.get(`${mapBoxUrl}/coordinates/?address=${address}`, config);
};

export default { getAddress, getCoordinates };
