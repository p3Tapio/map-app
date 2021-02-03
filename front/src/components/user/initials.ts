import { List } from '../../state/reducers/list/listTypes';
import { Location } from '../../state/reducers/location/locationTypes';

export const initialList: List = {
  _id: '',
  name: '',
  description: '',
  defaultview: {
    lat: 35,
    lng: 10,
    zoom: 2,
  },
  public: false,
  country: '',
  place: '',
  createdBy: '',
  locations: [],
};
export const initialLocation: Location = {
  _id: '',
  name: '',
  address: '',
  coordinates: { lat: 0, lng: 0 },
  description: '',
  category: '',
  imageLink: '',
  createdBy: '',
  list: '',
};
