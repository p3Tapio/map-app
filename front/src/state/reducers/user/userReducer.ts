import {
  UserDispatchTypes, LoggedUser, REGISTER, LOGIN,
} from './userTypes';

interface DefaultState {
  user?: LoggedUser;
}
const defaultState: DefaultState = {};
// eslint-disable-next-line max-len
const userReducer = (state: DefaultState = defaultState, action: UserDispatchTypes): DefaultState => {
  switch (action.type) {
    case REGISTER:
      return { user: action.payload };
    case LOGIN:
      return { user: action.payload };
    default:
      return state;
  }
};
export default userReducer;
