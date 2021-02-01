export const GETLOCATIONS = 'GETLOCATIONS';
export const CREATELOCATION = 'CREATELOCATION';
export const GETUSERLOCATIONS = 'GETUSERLOCATIONS';
export const UPDATELOCATION = 'UPDATELOCATION';
export const DELETELOCATION = 'DELETELOCATION';
export const CLEARUSERDATA = 'CLEARUSERDATA';

export interface NewLocation {
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  description: string;
  category: string;
  imageLink: string;
}
export interface Location extends NewLocation {
  _id: string;
  createdBy: string;
  list: string;
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
export interface UpdateLocation {
  type: typeof UPDATELOCATION;
  payload: Location;
}
export interface DeleteLocation {
  type: typeof DELETELOCATION;
  payload: string;
}
export interface ClearUserData {
  type: typeof CLEARUSERDATA;
}

export type LocationDispatchTypes = CreateLocation | GetLocations | GetUserLocations | UpdateLocation | DeleteLocation | ClearUserData;
