import { FormEvent } from 'react';
import { Location } from '../../../state/locationService/locationTypes';
import { Defaultview } from '../lists/listTypes';

export interface LocationValidationMessage {
  nameErr?: string;
  addressErr?: string;
  coordinatesErr?: string;
  descriptionErr?: string;
  categoryErr?: string;
}
// modals ----------------------------------------------
export interface ModalProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface CreateNewLocationModalProps extends ModalProps {
  defaultview: Defaultview;
}
export interface DeleteModalProps extends ModalProps {
  id: string;
  name: string;
  handleDelete: (id: string, name: string) => void;
}
export interface EditModalProps extends ModalProps {
  location: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
  defaultview: Defaultview;
}
export interface SingleLocationMapProps extends ModalProps {
  location: Location | undefined;
}
export interface LocationPopUpModalProps extends ModalProps {
  location: Location;
}
//  -------------------------------
interface BaseLocationComponentsProps {
  location: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
  validationMsg: LocationValidationMessage;
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
  defaultview: Defaultview;
}
export interface LocationListProps {
  locations: Location[] | undefined;
  location: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
  defaultview: Defaultview;
  showDelete: boolean;
  setShowDelete: React.Dispatch<React.SetStateAction<boolean>>;
  showEdit: boolean;
  setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface LocationCardProps {
  location: Location;
  setShowMap: React.Dispatch<React.SetStateAction<boolean>>;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
  setShowDelete?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEdit?: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
}
