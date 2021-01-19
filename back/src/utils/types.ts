import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  password: string;
  locations: ILocation[];
}
export interface NewUser {
  username: string;
  password: string;
}

export interface ILocation extends Document {
  _id: Types.ObjectId;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  }
  description: string;
  category: string;
  imageLink?: string;
  createdBy: IUser;
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
export enum Category {
  Sights = "sights",
  FoodDrink = "foodDrink",
  Shopping = "shopping",
  MuseumsArt = "museumsArt",
}