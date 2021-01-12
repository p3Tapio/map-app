import express, { Request, Response, Router } from 'express';
import User from '../models/userModel';
const router: Router = express.Router();
// TODO 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/resetUser', async (_req: Request, res: Response)  => {
  await User.deleteMany({});
  res.status(204).end();
});

export default router; 