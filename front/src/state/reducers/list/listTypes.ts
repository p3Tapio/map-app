import { Location } from '../location/locationTypes';

export const GETPUBLICLISTS = 'GETPUBLICLISTS';
export const GETUSERLISTS = 'GETUSERLISTS';
export const CREATELIST = 'CREATELIST';

export interface NewList {
  name: string;
  description: string;
  defaultview: {
    lat: number;
    lng: number;
    zoom: number;
  };
  public: boolean;
  country: string;
  place: string;
}
export interface List extends NewList {
  _id: string;
  createdBy: string;
  locations: Location[];
}
export interface GetPublicLists {
  type: typeof GETPUBLICLISTS;
  payload: List[];
}
export interface GetUserLists {
  type: typeof GETUSERLISTS;
  payload: List[];
}

export interface CreateList {
  type: typeof CREATELIST;
  payload: List;
}

export type ListDispatchTypes = GetPublicLists | GetUserLists | CreateList
