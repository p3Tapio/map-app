/* eslint-disable no-console */
import { Request, Response } from 'express';

export const unknownEndpoint = (req: Request, res: Response): void => {
  res.status(404).send({ error: 'unknown endpoint' });
  console.error(`Request failed with unknown endpoint error to ${req.path}`);
};
