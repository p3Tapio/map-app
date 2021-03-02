import { Location } from '../../services/locationTypes';
import { CommentReply } from '../../services/replyService';

export const GETPUBLICLISTS = 'GETPUBLICLISTS';
export const GETUSERLISTS = 'GETUSERLISTS';
export const CREATELIST = 'CREATELIST';
export const UPDATELIST = 'UPDATELIST';
export const DELETELIST = 'DELETELIST';
export const TOGGLEFAVORITE = 'TOGGLEFAVORITE';

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

export interface ListComment {
  _id: string;
  user: {
    _id: string;
    username: string;
  };
  list: string;
  comment: string;
  date: Date;
  replies: CommentReply[];
}
export interface List extends NewList {
  _id: string;
  createdBy: { _id: string; username: string };
  locations: Location[];
  favoritedBy: string[];
  comments: ListComment[];
  date: Date;
  region: string;
  subregion: string;
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
export interface ToggleFavorite {
  type: typeof TOGGLEFAVORITE;
  payload: List;
}

export type ListDispatchTypes = GetPublicLists | GetUserLists | CreateList | DeleteList | UpdateList | ToggleFavorite
