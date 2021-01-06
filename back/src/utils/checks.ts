/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NewUser } from './types';

const isString = (text: any): text is string => typeof text === 'string' || text instanceof String;

const parseInputString = (input: any): string => {
  if (!input || !isString(input)) {
    throw new Error('input missing or in wrong format');
  }
  return input;
};

const toNewUser = (object: any): NewUser => {
  const newUser: NewUser = {
    username: parseInputString(object.username),
    password: parseInputString(object.password),
  };
  return newUser;
};

export { toNewUser };
