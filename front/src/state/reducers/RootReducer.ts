import { combineReducers } from 'redux';
import userReducer from './user/userReducer';

const RootReducer = combineReducers({
  user: userReducer,
});
export default RootReducer;
