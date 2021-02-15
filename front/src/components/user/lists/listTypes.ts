import { FormEvent } from 'react';
import { ModalProps } from '../locations/locationsTypes'; // show, setShow
import { List } from '../../../state/reducers/list/listTypes';
import { Location } from '../../../state/locationService/locationTypes';

export interface Defaultview {
  lat: number;
  lng: number;
  zoom: number;
}

export interface ListValidationMessage {
  nameErr?: string;
  descriptionErr?: string;
  defaultviewErr?: string;
  countryErr?: string;
  placeErr?: string;
}

export interface CreateNewListModalProps extends ModalProps {
  list: List;
  setList: React.Dispatch<React.SetStateAction<List>>;
}
export interface EditListModalProps extends ModalProps {
  list: List;
  setList: React.Dispatch<React.SetStateAction<List>>;
}
export interface DefaultViewMapProps {
  list: List;
  setList: React.Dispatch<React.SetStateAction<List>>;
  validationMsg: ListValidationMessage;
}
export interface ListFormProps {
  handleClose: () => void;
  handleSubmit: (ev: FormEvent) => void;
  list: List;
  setList: React.Dispatch<React.SetStateAction<List>>;
  validationMsg: ListValidationMessage;
  formType: string;
}
export interface ListLocationsMapProps {
  defaultview: Defaultview;
  locations: Location[] | undefined;
}
export interface ListListProps {
  userLists: List[] | undefined;
  showDelete: boolean;
  setShowDelete: React.Dispatch<React.SetStateAction<boolean>>;
  showEdit: boolean;
  setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface UserFavoriteProps {
  lists: List[];
}
