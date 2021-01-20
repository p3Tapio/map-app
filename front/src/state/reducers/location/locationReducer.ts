import {
  LocationDispatchTypes, Location, GETLOCATIONS, CREATELOCATION,
} from './locationTypes';

interface LocationState {
  locations?: Location[];
}
const locationState: LocationState = { locations: undefined };

const locationReducer = (state: LocationState = locationState, action: LocationDispatchTypes): LocationState => {
  switch (action.type) {
    case GETLOCATIONS:
      return { locations: action.payload };
    case CREATELOCATION: {
      const locations = state.locations?.concat(action.payload);
      return { locations };
    }
    default:
      return state;
  }
};
export default locationReducer;
