import { Location } from '../../locationService/locationTypes';

export const GETPUBLICLISTS = 'GETPUBLICLISTS';
export const GETUSERLISTS = 'GETUSERLISTS';
export const CREATELIST = 'CREATELIST';
export const UPDATELIST = 'UPDATELIST';
export const DELETELIST = 'DELETELIST';

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
  createdBy: { _id: string; username: string };
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
export interface UpdateList {
  type: typeof UPDATELIST;
  payload: List;
}
export interface DeleteList {
  type: typeof DELETELIST;
  payload: string;
}

export type ListDispatchTypes = GetPublicLists | GetUserLists | CreateList | DeleteList | UpdateList
