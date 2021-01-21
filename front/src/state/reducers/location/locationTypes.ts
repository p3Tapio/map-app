export const GETLOCATIONS = 'GETLOCATIONS';
export const CREATELOCATION = 'CREATELOCATION';
export const GETUSERLOCATIONS = 'GETUSERLOCATIONS';

export interface NewLocation {
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  description: string;
  category: string;
  imageLink: string;
}
export interface Location {
  _id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  description: string;
  category: string;
  imageLink: string;
  createdBy: string;
}
export interface CreateLocation {
  type: typeof CREATELOCATION;
  payload: Location;
}
export interface GetLocations {
  type: typeof GETLOCATIONS;
  payload: Location[];
}
export interface GetUserLocations {
  type: typeof GETUSERLOCATIONS;
  payload: Location[];
}

export type LocationDispatchTypes = CreateLocation | GetLocations | GetUserLocations;
