import jwt from 'jsonwebtoken';
import { SECRET } from './config';

export const createToken = (username: string, id: string): string => {
  const forToken: Record<string, string> = { username, id };
  return jwt.sign(forToken, SECRET as string);
};
