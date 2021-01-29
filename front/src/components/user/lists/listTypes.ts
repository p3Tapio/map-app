import { ModalProps } from '../locations/locationsTypes'; // show, setShow

interface NewList {
  name: string;
  description: string;
  defaultview: {
    lat: number;
    lng: number;
    zoom: number;
  };
}
export interface CreateNewListModalProps extends ModalProps {
  newList: NewList;
  setNewList: React.Dispatch<React.SetStateAction<NewList>>;
}
export interface DefaultViewMapProps {
  newList: NewList;
  setNewList: React.Dispatch<React.SetStateAction<NewList>>;
}
export interface ListFormProps {
  handleClose: () => void;
}
