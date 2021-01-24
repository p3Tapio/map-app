import { Document, Types } from 'mongoose';

export interface NewUser {
  username: string;
  password: string;
}
export interface IUser extends Document, NewUser {
  _id: Types.ObjectId;
  locations: ILocation[];
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
}

export interface ILocation extends Document, NewLocation {
  _id: Types.ObjectId;
  createdBy: IUser;
}
export interface UpdatedLocation extends NewLocation {
  _id: Types.ObjectId;
  createdBy: IUser;
}

export enum Category {
  Sights = "sights",
  FoodDrink = "foodDrink",
  Shopping = "shopping",
  MuseumsArt = "museumsArt",
}