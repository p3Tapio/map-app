import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Location from '../models/locationModel';
import User from '../models/userModel';
import { checkLocationValues } from '../utils/checks';
import { checkToken } from '../utils/tokens';
import { IUser, ILocation } from '../utils/types';
const router = express.Router();


router.get('/all', async (_req: Request, res: Response) => {
  // const locations = await Location.find({}).populate('createdBy', {username: 1, _id: 0}); Tyypitys ?????? 
  const locations = await Location.find({}) as ILocation[];
  res.json(locations);
});
router.get('/user', async (req: Request, res: Response) => {
  try {
    if (req.header('token') && checkToken(req.header('token'))) {
      const userId = checkToken(req.header('token'));
      const locsinDb = await Location.find({}) as ILocation[];
      const locations = locsinDb.filter(x => x.createdBy.toString() === userId);
      res.json(locations);
    } else {
      res.status(401).json({ error: 'unauthorized' });
    }
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});
router.post('/create', async (req: Request, res: Response) => {
  try {
    if (req.header('token')) {
      const userId = checkToken(req.header('token'));
      const newLocation = checkLocationValues(req.body);

      const user = await User.findById(userId) as IUser;
      const location = new Location({
        _id: new mongoose.Types.ObjectId,
        name: newLocation.name,
        address: newLocation.address,
        coordinates: {
          lat: newLocation.coordinates.lat,
          lng: newLocation.coordinates.lng,
        },
        description: newLocation.description,
        category: newLocation.category,
        imageLink: newLocation.imageLink ? newLocation.imageLink : '-',
        createdBy: userId
      });

      const savedLocation: ILocation = await location.save();
      user.locations = user.locations.concat(savedLocation);
      await user.save();
      res.status(200).json(savedLocation);

    } else throw new Error('No token');
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});
router.delete('/delete/:id', async (req: Request, res: Response) => {
  try {
    if (req.header('token') && checkToken(req.header('token'))) {
      const userId = checkToken(req.header('token'));
      const location = await Location.findById(req.params.id) as ILocation;
      if (!location) throw new Error('No location found');
      if (location.createdBy.toString() === userId) {
        await Location.findOneAndRemove({ _id: req.params.id });
        res.status(204).end();
      }
    }
    res.status(401).send({ error: 'unauthorized' });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});
export default router;