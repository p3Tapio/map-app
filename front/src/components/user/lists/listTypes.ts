import { FormEvent } from 'react';
import { ModalProps } from '../locations/locationsTypes'; // show, setShow
import { NewList } from '../../../state/reducers/list/listTypes';

export interface ListValidationMessage {
  nameErr?: string;
  descriptionErr?: string;
  defaultviewErr?: string;
}

export interface CreateNewListModalProps extends ModalProps {
  newList: NewList;
  setNewList: React.Dispatch<React.SetStateAction<NewList>>;
}
export interface DefaultViewMapProps {
  newList: NewList;
  setNewList: React.Dispatch<React.SetStateAction<NewList>>;
  validationMsg: ListValidationMessage;
}
export interface ListFormProps {
  handleClose: () => void;
  handleSubmit: (ev: FormEvent) => void;
  newList: NewList;
  setNewList: React.Dispatch<React.SetStateAction<NewList>>;
  validationMsg: ListValidationMessage;
}
