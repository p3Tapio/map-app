import { Location } from '../../../state/reducers/location/locationTypes';

export interface SingleLocationMapProps {
  location: Location | undefined;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface LocationListProps {
  locations: Location[] | undefined;
  handleDelete: (id: string, name: string) => void;
  showDelete: boolean;
  setShowDelete: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface DeleteModalProps {
  id: string;
  name: string;
  handleDelete: (id: string, name: string) => void;
  showDelete: boolean;
  setShowDelete: React.Dispatch<React.SetStateAction<boolean>>;
}