export const REGISTER = 'REGISTER';
export const LOGIN = 'LOGIN';

export interface SigningUser {
  username: string;
  password: string;
}
export interface LoggedUser extends SigningUser {
  id: string;
}

export interface Register {
  type: typeof REGISTER;
  payload: LoggedUser;
}
export interface Login {
  type: typeof LOGIN;
  payload: LoggedUser;
}

export type UserDispatchTypes = Register | Login;
