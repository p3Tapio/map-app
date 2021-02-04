import express, { Request, Response, Router } from 'express';
import User from '../models/userModel';
import Location from '../models/locationModel';
import List from '../models/listModel';

const router: Router = express.Router();

router.post('/resetUser', async (_req: Request, res: Response)  => {
  await User.deleteMany({});
  res.status(204).end();
});
router.post('/resetLocations', async (_req: Request, res:Response) => {
  await Location.deleteMany({});
  res.status(204).end();
});
router.get('/allLists', async (_req: Request, res:Response) => {
  const lists = await List.find({}).populate('locations');
  res.json(lists);
});
export default router; 