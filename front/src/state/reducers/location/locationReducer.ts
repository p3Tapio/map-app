import {
  LocationDispatchTypes, Location, GETLOCATIONS, CREATELOCATION, GETUSERLOCATIONS, DELETELOCATION,
} from './locationTypes';

interface LocationState {
  locations?: Location[];
  userLocations?: Location[];
}
const locationState: LocationState = { locations: undefined };

const locationReducer = (state: LocationState = locationState, action: LocationDispatchTypes): LocationState => {
  switch (action.type) {
    case GETLOCATIONS:
      return { ...state, locations: action.payload };
    case GETUSERLOCATIONS:
      return { ...state, userLocations: action.payload };
    case CREATELOCATION: {
      const locations = state.locations?.concat(action.payload);
      const userLocations = state.userLocations?.concat(action.payload);
      return { ...state, locations, userLocations };
    }
    case DELETELOCATION: {
      const userLocations = state.userLocations?.filter((x) => x._id !== action.payload);
      const locations = state.userLocations?.filter((x) => x._id !== action.payload);
      return { ...state, locations, userLocations };
    }
    default:
      return state;
  }
};
export default locationReducer;
