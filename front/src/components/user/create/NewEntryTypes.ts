import { FormEvent } from 'react';
import { NewLocation } from '../../../state/reducers/location/locationTypes';

export interface ValidationMessage {
  nameErr?: string;
  addressErr?: string;
  coordinatesErr?: string;
  descriptionErr?: string;
  categoryErr?: string;
}
export interface CreateNewModalProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface CreateNewFormProps {
  location: NewLocation;
  setLocation: React.Dispatch<React.SetStateAction<NewLocation>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  setPinPosition: React.Dispatch<React.SetStateAction<number[]>>;
  validationMsg: ValidationMessage;
}
export interface MapProps {
  pinPosition: number[];
  setPinPosition: React.Dispatch<React.SetStateAction<number[]>>;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  location: NewLocation;
  setLocation: React.Dispatch<React.SetStateAction<NewLocation>>;
  validationMsg: ValidationMessage;
}
