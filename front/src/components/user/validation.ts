import { Location, NewLocation } from '../../state/locationService/locationTypes';
import { List, NewList } from '../../state/reducers/list/listTypes';
import { ListValidationMessage } from './lists/listTypes';
import { LocationValidationMessage } from './locations/locationsTypes';

let locationValidationMsg: LocationValidationMessage;
let listValidationMsg: ListValidationMessage;
// TODO koita yhdistää update ja new
export const validateNewLocation = (location: NewLocation): NewLocation | LocationValidationMessage => {
  locationValidationMsg = {};
  if (location.name === '') locationValidationMsg = { ...locationValidationMsg, nameErr: 'Name is required.' };
  if (location.address === '') locationValidationMsg = { ...locationValidationMsg, addressErr: 'Address is required.' };
  if (location.coordinates.lat === 0) locationValidationMsg = { ...locationValidationMsg, coordinatesErr: 'Please add location to map.' };
  if (location.description === '') locationValidationMsg = { ...locationValidationMsg, descriptionErr: 'Description is required.' };
  if (location.category === '') locationValidationMsg = { ...locationValidationMsg, categoryErr: 'Category is required.' };
  if (Object.keys(locationValidationMsg).length !== 0) {
    return locationValidationMsg;
  }
  return location;
};
export const validateUpdated = (location: Location): Location | LocationValidationMessage => {
  locationValidationMsg = {};
  if (location.name === '') locationValidationMsg = { ...locationValidationMsg, nameErr: 'Name is required.' };
  if (location.address === '') locationValidationMsg = { ...locationValidationMsg, addressErr: 'Address is required.' };
  if (location.coordinates.lat === 0) locationValidationMsg = { ...locationValidationMsg, coordinatesErr: 'Please add location to map.' };
  if (location.description === '') locationValidationMsg = { ...locationValidationMsg, descriptionErr: 'Description is required.' };
  if (location.category === '') locationValidationMsg = { ...locationValidationMsg, categoryErr: 'Category is required.' };
  if (Object.keys(locationValidationMsg).length !== 0) {
    return locationValidationMsg;
  }
  return location;
};
export const validateNewList = (list: NewList): NewList | ListValidationMessage => {
  listValidationMsg = {};
  if (list.name === '') listValidationMsg = { ...listValidationMsg, nameErr: 'Name is required.' };
  if (list.description === '') listValidationMsg = { ...listValidationMsg, descriptionErr: 'Description is required.' };
  if (list.defaultview.lat === 34.88593094075317 && list.defaultview.lng === 9.843750000000002 && list.defaultview.zoom === 2) {
    listValidationMsg = { ...listValidationMsg, defaultviewErr: 'Please set a default view for your location list.' };
  }
  if (Object.keys(listValidationMsg).length !== 0) {
    return listValidationMsg;
  }
  return list;
};
export const validateUpdatedList = (list: List): List | ListValidationMessage => {
  listValidationMsg = {};
  if (list.name === '') listValidationMsg = { ...listValidationMsg, nameErr: 'Name is required.' };
  if (list.description === '') listValidationMsg = { ...listValidationMsg, descriptionErr: 'Description is required.' };
  if (list.defaultview.lat === 34.88593094075317 && list.defaultview.lng === 9.843750000000002 && list.defaultview.zoom === 2) {
    listValidationMsg = { ...listValidationMsg, defaultviewErr: 'Please set a default view for your location list.' };
  }
  // if (list.place === '') listValidationMsg = { ...listValidationMsg, placeErr: 'Place is required.' };
  if (list.country === '') listValidationMsg = { ...listValidationMsg, countryErr: 'Country is required.' };
  if (Object.keys(listValidationMsg).length !== 0) {
    return listValidationMsg;
  }
  return list;
};
