/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NewUser, Category, NewLocation } from "./types";

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

const checkUserValues = (object: any): NewUser => {
  const newUser: NewUser = {
    username: parseInputString(object.username),
    password: parseInputString(object.password),
  };
  return newUser;
};
const checkLocationValues = (object: any): NewLocation => {
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

export { checkUserValues, checkLocationValues };
