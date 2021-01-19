import jwt from 'jsonwebtoken';
import { SECRET } from './config';

interface Decoded {
    username: string;
    id: string;
    iat: number;
}

export const createToken = (username: string, id: string): string => {
  const forToken: Record<string, string> = { username, id };
  return jwt.sign(forToken, SECRET as string);
};
export const checkToken = (token: string | undefined): string | undefined => {
  if (token) {
    const decoded: Decoded = jwt.verify(token, SECRET as string) as Decoded;
    if (decoded) {
      return decoded.id;
    }
  }
  return undefined;
}; 
