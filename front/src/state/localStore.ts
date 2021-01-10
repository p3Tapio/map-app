import { LoggedUser } from "./reducers/user/userTypes";

export const getUser = (): LoggedUser => {
  return JSON.parse(window.localStorage.getItem('loggedUser') as string);
}
export const setUser = (user: LoggedUser): void => {
  window.localStorage.setItem('loggedUser', JSON.stringify(user))
}