import { combineReducers } from 'redux';
import { Dispatch } from 'react';
import userReducer, { UserState } from './user/userReducer';
import listReducer, { ListState } from './list/listReducer';
import { LOGOUT, UserDispatchTypes } from './user/userTypes';
import { ListDispatchTypes } from './list/listTypes';

interface AppState {
  user: UserState;
  lists: ListState;
}
type AppDispatchTypes = UserDispatchTypes | ListDispatchTypes;

export const logoutUser = () => (dispatch: Dispatch<AppDispatchTypes>): void => {
  dispatch({
    type: LOGOUT,
  });
};

const appReducer = combineReducers({
  user: userReducer,
  lists: listReducer,
});

const RootReducer = (state: AppState | undefined, action: AppDispatchTypes): AppState => {
  if (action.type === 'LOGOUT') {
    window.localStorage.clear();
    return { user: {}, lists: { userLists: [], publicLists: state?.lists.publicLists } };
  }
  return appReducer(state, action);
};

export default RootReducer;
