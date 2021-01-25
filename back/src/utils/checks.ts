/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Types } from "mongoose";
import { NewUser, Category, NewLocation, UpdatedLocation, IUser } from "./types";

const isString = (text: any): text is string => typeof text === 'string' || text instanceof String;
const isNumeric = (no: any): no is number => !isNaN(Number(no));
const isCategory = (cat: any): cat is Category => Object.values(Category).includes(cat);

function parseInputString(input: any): string {
  if (!input || !isString(input)) {
    throw new Error('input missing or in wrong format');
  }
  return input;
}
const parseInputNumber = (input: any): number => {
  if (!input || !isNumeric(input)) {
    throw new Error('input missing or in wrong format');
  }
  return input;
};
const parseCategory = (input: any): string => {
  if (!input || !isCategory(input)) {
    throw new Error('input missing or in wrong format');
  }
  return input;
};
const parseImageLink = (input: any): string | undefined => {
  if (!input) {
    return undefined;
  } else if (!isString(input)) {
    throw new Error('input in wrong format');
  }
  return input;
};

const parseCoordinates = (input: any): { lat: number; lng: number; } => {
  if (!input) throw new Error('input missing or in wrong format');
  const coordinates = {
    lat: parseInputNumber(input.lat),
    lng: parseInputNumber(input.lng),
  };
  return coordinates;
};
// TODO ... miten tyypin tarkistat? Tässä 12345 menee läpi
const parseId = (input: any): Types.ObjectId  => {
  if (!input) {
    throw new Error('input missing or in wrong format');
  }
  return input as Types.ObjectId;
};
// Tässä väärä palauttaa "Cast to ObjectId failed for value \"12345\" at path \"createdBy\""
const parseUser = (input: any): IUser => {
  if (!input) {
    throw new Error('input missing or in wrong format');
  }
  return input as IUser;
};

const checkUserValues = (object: any): NewUser => {
  const newUser: NewUser = {
    username: parseInputString(object.username),
    password: parseInputString(object.password),
  };
  return newUser;
};
const checkNewLocationValues = (object: any): NewLocation => {
    const newLocation = {
      name: parseInputString(object.name),
      address: parseInputString(object.address),
      coordinates: parseCoordinates(object.coordinates),
      description: parseInputString(object.description),
      category: parseCategory(object.category),
      imageLink: parseImageLink(object.imageLink)
    };
    return newLocation;
};


const checkUpdatedValues = (object: any): UpdatedLocation => {
  const updated = {
    _id: parseId(object._id),
    name: parseInputString(object.name),
    address: parseInputString(object.address),
    coordinates: parseCoordinates(object.coordinates),
    description: parseInputString(object.description),
    category: parseCategory(object.category),
    imageLink: parseImageLink(object.imageLink),
    createdBy: parseUser(object.createdBy),
  };
  return updated;
};

export { checkUserValues, checkNewLocationValues, checkUpdatedValues };
