import { FormEvent } from 'react';
import { Location } from '../../../state/reducers/location/locationTypes';

export interface ValidationMessage {
  nameErr?: string;
  addressErr?: string;
  coordinatesErr?: string;
  descriptionErr?: string;
  categoryErr?: string;
}
// modals ----------------------------------------------
interface ModalProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface CreateNewModalProps extends ModalProps {
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  pinPosition: number[];
  setPinPosition: React.Dispatch<React.SetStateAction<number[]>>;
  validationMsg: ValidationMessage;
  setValidationMsg: React.Dispatch<React.SetStateAction<ValidationMessage>>;
  location: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
}

export interface DeleteModalProps extends ModalProps {
  id: string;
  name: string;
  handleDelete: (id: string, name: string) => void;
}
export interface EditModalProps extends ModalProps {
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  pinPosition: number[];
  setPinPosition: React.Dispatch<React.SetStateAction<number[]>>;
  validationMsg: ValidationMessage;
  setValidationMsg: React.Dispatch<React.SetStateAction<ValidationMessage>>;
  location: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
}
export interface SingleLocationMapProps extends ModalProps {
  location: Location | undefined;
}

//  -------------------------------

export interface LocationFormProps {
  location: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  setPinPosition: React.Dispatch<React.SetStateAction<number[]>>;
  validationMsg: ValidationMessage;
  handleClose: () => void;
}
export interface MapProps {
  pinPosition: number[];
  setPinPosition: React.Dispatch<React.SetStateAction<number[]>>;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  validationMsg: ValidationMessage;
}
export interface LocationListProps {
  locations: Location[] | undefined;
  handleDelete: (id: string, name: string) => void;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  pinPosition: number[];
  setPinPosition: React.Dispatch<React.SetStateAction<number[]>>;
  validationMsg: ValidationMessage;
  setValidationMsg: React.Dispatch<React.SetStateAction<ValidationMessage>>;
  location: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
}
