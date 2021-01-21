import { Location } from '../../../state/reducers/location/locationTypes';

export interface SingleLocationMapProps {
  location: Location | undefined;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
