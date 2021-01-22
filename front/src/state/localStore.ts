import { LoggedUser } from './reducers/user/userTypes';

export const getUser = (): LoggedUser => JSON.parse(window.localStorage.getItem('loggedUser') as string);
export const setUser = (user: LoggedUser): void => {
  window.localStorage.setItem('loggedUser', JSON.stringify(user));
};
export const getToken = (): string | undefined => {
  const user = JSON.parse(window.localStorage.getItem('loggedUser') as string);
  if (user) return user.token;
  return undefined;
};
export const createConfig = (): { headers: { token?: string } } => {
  const token = getToken();
  return { headers: { token } };
};
