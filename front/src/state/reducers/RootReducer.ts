import { combineReducers } from 'redux';
import { Dispatch } from 'react';
import userReducer, { UserState } from './user/userReducer';
import locationReducer, { LocationState } from './location/locationReducer';
import listReducer, { ListState } from './list/listReducer';
import { LOGOUT, UserDispatchTypes } from './user/userTypes';
import { LocationDispatchTypes } from './location/locationTypes';
import { ListDispatchTypes } from './list/listTypes';

interface AppState {
  user: UserState;
  locations: LocationState;
  lists: ListState;
}
type AppDispatchTypes = UserDispatchTypes | LocationDispatchTypes | ListDispatchTypes;

export const logoutUser = () => (dispatch: Dispatch<AppDispatchTypes>): void => {
  dispatch({
    type: LOGOUT,
  });
};

const appReducer = combineReducers({
  user: userReducer,
  locations: locationReducer,
  lists: listReducer,
});

const RootReducer = (state: AppState | undefined, action: AppDispatchTypes): AppState => {
  if (action.type === 'LOGOUT') {
    window.localStorage.clear();
    return { user: {}, locations: {}, lists: {} };
  }
  return appReducer(state, action);
};

export default RootReducer;
