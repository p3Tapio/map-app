import { combineReducers } from 'redux';
import userReducer from './user/userReducer';
import locationReducer from './location/locationReducer';

const RootReducer = combineReducers({
  user: userReducer,
  locations: locationReducer,
});

export default RootReducer;
