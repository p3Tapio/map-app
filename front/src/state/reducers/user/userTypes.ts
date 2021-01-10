export const REGISTER = 'REGISTER';
export const LOGIN = 'LOGIN';

export type LoggedUser = {
  data: {
    id: string;
    username: string;
    token: string;
  };
}
export type SigningUser = {
  username: string;
  password: string;
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
