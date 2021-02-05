/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose, { Types } from "mongoose";
import { NewUser, Category, NewLocation, Location, NewList, Defaultview, List } from "./types";

const isString = (text: any): text is string => typeof text === 'string' || text instanceof String;
const isNumeric = (no: any): no is number => !isNaN(Number(no));
const isCategory = (cat: any): cat is Category => Object.values(Category).includes(cat);
const isBoolean = (value: any): value is boolean => typeof value === 'boolean' || value instanceof Boolean;

function parseInputString(input: any): string {
  if (!input || !isString(input)) {
    throw new Error('input missing or in wrong format: string expected.');
  }
  return input;
}
const parseInputNumber = (input: any): number => {
  if (!input || !isNumeric(input)) {
    throw new Error('input missing or in wrong format: number expected.');
  }
  return input;
};
const parseCategory = (input: any): string => {
  if (!input || !isCategory(input)) {
    throw new Error('category missing or in wrong format');
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
  if (!input) throw new Error('coordinates missing or in wrong format.');
  const coordinates = {
    lat: parseInputNumber(input.lat),
    lng: parseInputNumber(input.lng),
  };
  return coordinates;
};
const parseId = (input: any): Types.ObjectId => {
  if (!input || !mongoose.isValidObjectId(input)) {
    throw new Error('input missing or in wrong format: id expected.');
  }
  return input as Types.ObjectId;
};
const parseDefaultview = (input: any): Defaultview => {
  if (!input || typeof input !== 'object') throw new Error('input missing or in wrong format: defaultview missing.');
  else if (!("lat" in input) || !("lng" in input) || !("zoom" in input)) throw new Error('defaultview missing required properties.')
  const defaultview = {
    lat: parseInputNumber(input.lat),
    lng: parseInputNumber(input.lng),
    zoom: parseInputNumber(input.zoom),
  };
  return defaultview;
};
const parseInputBoolean = (input: any): boolean => {
  if (typeof input === 'undefined' || !isBoolean(input)) {
    throw new Error('input missing or in wrong format: boolean expected.');
  }
  return input;
};
const parseLocationList = (input: any[]): Location[] => {
  if (input.length > 0) return input.map((x) => checkUpdatedLocationValues(x));
  return [];
};

// ---------------------------------------------------------

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
    imageLink: parseImageLink(object.imageLink),
    list: parseId(object.list),
  };
  return newLocation;
};
const checkUpdatedLocationValues = (object: any): Location => {
  const updated = {
    _id: parseId(object._id),
    name: parseInputString(object.name),
    address: parseInputString(object.address),
    coordinates: parseCoordinates(object.coordinates),
    description: parseInputString(object.description),
    category: parseCategory(object.category),
    imageLink: parseImageLink(object.imageLink),
    createdBy: parseId(object.createdBy),
    list: parseId(object.list),
  };
  return updated;
};
const checkNewListValues = (object: any): NewList => {  // TODO onko !value määritykset turhia jos ehdot myös locationiin? 
  if (!object || Object.keys(object).length === 0) throw new Error('No data.');
  else if (
    !("name" in object) ||
    !("description" in object) ||
    !("defaultview" in object) ||
    !("country" in object) ||
    !("place" in object) ||
    !("public" in object)) {
    throw new Error('object missing required properties.');
  }
  else {
    const newList = {
      name: parseInputString(object.name),
      description: parseInputString(object.description),
      defaultview: parseDefaultview(object.defaultview),
      country: parseInputString(object.country),
      place: parseInputString(object.place),
      public: parseInputBoolean(object.public),
    };
    return newList;
  }
};
const checkUpdatedListValues = (object: any): List => {
  if (!object || Object.keys(object).length === 0) throw new Error('No data.');
  else if (
    !("name" in object) ||
    !("description" in object) ||
    !("defaultview" in object) ||
    !("country" in object) ||
    !("place" in object) ||
    !("public" in object) ||
    !("createdBy" in object) || 
    !("locations" in object)) { 
    throw new Error('object missing required properties.');
  } else {
    const updated = {
      name: parseInputString(object.name),
      description: parseInputString(object.description),
      defaultview: parseDefaultview(object.defaultview),
      country: parseInputString(object.country),
      place: parseInputString(object.place),
      public: parseInputBoolean(object.public),
      createdBy: parseId(object.createdBy),
      locations: parseLocationList(object.locations),
    };
    return updated;
  }
};

export {
  checkUserValues,
  checkNewLocationValues,
  checkUpdatedLocationValues,
  checkNewListValues,
  checkUpdatedListValues,
};
