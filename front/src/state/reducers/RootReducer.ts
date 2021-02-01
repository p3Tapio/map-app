import { combineReducers } from 'redux';
import userReducer from './user/userReducer';
import locationReducer from './location/locationReducer';
import listReducer from './list/listReducer';

const RootReducer = combineReducers({
  user: userReducer,
  locations: locationReducer,
  lists: listReducer,
});

export default RootReducer;
