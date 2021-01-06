/* eslint-disable no-console */
import { Request, Response } from 'express';

export const unknownEndpoint = (req: Request, res: Response): void => {
  res.status(404).send({ error: 'unknown endpoint' });
  console.error(`Request failed with unknown endpoint error to ${req.path}`);
};

// export const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction): Response<string> | void=> {
//   if (err.name === 'ValidationError') {
//     console.error('Validation Error: ', err.message);
//     return res.status(400).json({ error: err.message });
//   } if (err.name === 'JsonWebTokenError') {
//     return res.status(401).json({ error: 'invalid token' });
//   }
//   return next(err);
// };
