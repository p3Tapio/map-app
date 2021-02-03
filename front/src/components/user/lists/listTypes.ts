import { FormEvent } from 'react';
import { ModalProps } from '../locations/locationsTypes'; // show, setShow
import { NewList, List } from '../../../state/reducers/list/listTypes';
import { Location } from '../../../state/reducers/location/locationTypes';

export interface Defaultview {
  lat: number;
  lng: number;
  zoom: number;
}

export interface ListValidationMessage {
  nameErr?: string;
  descriptionErr?: string;
  defaultviewErr?: string;
}

export interface CreateNewListModalProps extends ModalProps {
  newList: List;
  setNewList: React.Dispatch<React.SetStateAction<List>>;
}
export interface DefaultViewMapProps {
  newList: List;
  setNewList: React.Dispatch<React.SetStateAction<List>>;
  validationMsg: ListValidationMessage;
}
export interface ListFormProps {
  handleClose: () => void;
  handleSubmit: (ev: FormEvent) => void;
  newList: List;
  setNewList: React.Dispatch<React.SetStateAction<List>>;
  validationMsg: ListValidationMessage;
}
export interface ListLocationsMapProps {
  defaultview: Defaultview;
  locations: Location[] | undefined;
}
export interface ListListProps {
  userLists: List[] | undefined;
}
