import { Document, Types } from 'mongoose';

export interface NewUser {
  username: string;
  password: string;
}
export interface IUser extends Document, NewUser {
  _id: Types.ObjectId;
  locations: ILocation[];
  lists: IList[];
}
export interface NewUser {
  username: string;
  password: string;
}
export interface NewLocation {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  }
  description: string;
  category: string;
  imageLink?: string;
  list: Types.ObjectId;
}
export interface ILocation extends Document, NewLocation {
  _id: Types.ObjectId;
  createdBy: Types.ObjectId;
}
export interface UpdatedLocation extends NewLocation {
  _id: Types.ObjectId;
  createdBy: Types.ObjectId;
}
export enum Category {
  Sights = "sights",
  FoodDrink = "foodDrink",
  Shopping = "shopping",
  MuseumsArt = "museumsArt",
}
export interface Defaultview {
  lat: number;
  lng: number;
  zoom: number;
}
export interface NewList {
  name: string;
  description: string;
  defaultview: Defaultview;
  public: boolean;
  country: string;
  place: string;
}
export interface List extends NewList {
  createdBy: Types.ObjectId;
  locations: ILocation[];
}
export interface IList extends Document, NewList, List {
  _id: Types.ObjectId;
}