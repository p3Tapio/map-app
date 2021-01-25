import express, { Request, Response, Router } from 'express';
import User from '../models/userModel';
import Location from '../models/locationModel';
const router: Router = express.Router();

router.post('/resetUser', async (_req: Request, res: Response)  => {
  await User.deleteMany({});
  res.status(204).end();
});
router.post('/resetLocations', async (_req: Request, res:Response) => {
  await Location.deleteMany({});
  res.status(204).end();
});

export default router; 