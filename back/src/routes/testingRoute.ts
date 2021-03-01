import express, { Request, Response, Router } from 'express';
import User from '../models/userModel';
import Location from '../models/locationModel';
import List from '../models/listModel';
import Comment from '../models/commentModel';

const router: Router = express.Router();

router.post('/resetUser', async (_req: Request, res: Response)  => {
  await User.deleteMany({});
  res.status(204).end();
});
router.post('/resetLocations', async (_req: Request, res:Response) => {
  await Location.deleteMany({});
  res.status(204).end();
});
router.post('/resetLists', async (_req: Request, res:Response) => {
  await List.deleteMany({});
  res.status(204).end();
});
router.post('/resetComments', async(_req:Request, res: Response) => {
  await Comment.deleteMany({});
  res.status(204).end();
});

export default router; 