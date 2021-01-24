import {
  UserDispatchTypes, LoggedUser, REGISTER, LOGIN,
} from './userTypes';

interface UserState {
  user?: LoggedUser;
}
const userState: UserState = { user: undefined };

const userReducer = (state: UserState = userState, action: UserDispatchTypes): UserState => {
  switch (action.type) {
    case REGISTER:
      return { ...state, user: action.payload };
    case LOGIN:
      return { ...state, user: action.payload };
    default:
      return state;
  }
};
export default userReducer;
