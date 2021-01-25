import { Location, NewLocation } from '../../../state/reducers/location/locationTypes';
import { ValidationMessage } from './locationsTypes';

let validationMsg: ValidationMessage;

export const validateNewLocation = (location: NewLocation): NewLocation | ValidationMessage => {
  validationMsg = {};
  if (location.name === '') validationMsg = { ...validationMsg, nameErr: 'Name is required.' };
  if (location.address === '') validationMsg = { ...validationMsg, addressErr: 'Address is required.' };
  if (location.coordinates.lat === 0) validationMsg = { ...validationMsg, coordinatesErr: 'Please add location to map.' };
  if (location.description === '') validationMsg = { ...validationMsg, descriptionErr: 'Description is required.' };
  if (location.category === '') validationMsg = { ...validationMsg, categoryErr: 'Category is required.' };
  if (Object.keys(validationMsg).length !== 0) {
    return validationMsg;
  }
  return location;
};
export const validateUpdated = (location: Location): Location | ValidationMessage => {
  validationMsg = {};
  if (location.name === '') validationMsg = { ...validationMsg, nameErr: 'Name is required.' };
  if (location.address === '') validationMsg = { ...validationMsg, addressErr: 'Address is required.' };
  if (location.coordinates.lat === 0) validationMsg = { ...validationMsg, coordinatesErr: 'Please add location to map.' };
  if (location.description === '') validationMsg = { ...validationMsg, descriptionErr: 'Description is required.' };
  if (location.category === '') validationMsg = { ...validationMsg, categoryErr: 'Category is required.' };
  if (Object.keys(validationMsg).length !== 0) {
    return validationMsg;
  }
  return location;
};
