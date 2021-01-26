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
  validationMsg: ValidationMessage;
  setValidationMsg: React.Dispatch<React.SetStateAction<ValidationMessage>>;
  location: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
}
export interface SingleLocationMapProps extends ModalProps {
  location: Location | undefined;
}
//  -------------------------------
interface BaseLocationComponentsProps {
  location: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
  validationMsg: ValidationMessage;
}
export interface LocationFormProps extends BaseLocationComponentsProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  handleClose: () => void;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
}
export interface MapProps extends BaseLocationComponentsProps {
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
}
export interface LocationListProps extends BaseLocationComponentsProps {
  locations: Location[] | undefined;
  handleDelete: (id: string, name: string) => void;
  setValidationMsg: React.Dispatch<React.SetStateAction<ValidationMessage>>;
}
