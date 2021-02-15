export const REGISTER = 'REGISTER';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export interface SigningUser {
  username: string;
  password: string;
}
export interface LoggedUser extends SigningUser {
  id: string;
  favorites: string[];
}
export interface Register {
  type: typeof REGISTER;
  payload: LoggedUser;
}
export interface Login {
  type: typeof LOGIN;
  payload: LoggedUser;
}
export interface Logout {
  type: typeof LOGOUT;
}

export type UserDispatchTypes = Register | Login | Logout;
