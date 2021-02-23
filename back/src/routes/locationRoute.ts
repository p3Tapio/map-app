import express, { Request, Response } from 'express';
import Location from '../models/locationModel';
import User from '../models/userModel';
import List from '../models/listModel';
import { checkNewLocationValues, checkUpdatedLocationValues } from '../utils/checks';
import { checkToken } from '../utils/tokens';
import { IList, ILocation, IUser } from '../utils/types';

const router = express.Router();

router.post('/create', async (req: Request, res: Response) => {
  try {
    if (req.header('token') && checkToken(req.header('token'))) {
      const userId = checkToken(req.header('token'));
      const newLocation = checkNewLocationValues(req.body);

      const user = await User.findById(userId) as IUser;
      const list = await List.findById(newLocation.list) as IList;

      if (!list || !user) throw new Error('List or user not found');

      const location = new Location({
        name: newLocation.name,
        address: newLocation.address,
        coordinates: {
          lat: newLocation.coordinates.lat,
          lng: newLocation.coordinates.lng,
        },
        description: newLocation.description,
        category: newLocation.category,
        imageLink: newLocation.imageLink ? newLocation.imageLink : '-',
        createdBy: userId,
        list: newLocation.list,
        date: Date.now(),
      });

      const savedLocation = await location.save();
      user.locations = user.locations.concat(savedLocation);
      list.locations = list.locations.concat(savedLocation);
      await user.save();
      await list.save();

      res.status(200).json(savedLocation);

    } else res.status(401).send({ error: 'unauthorized' });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});
router.put('/update/:id', async (req: Request, res: Response) => {
  try {
    if (req.header('token') && checkToken(req.header('token'))) {
      const userId = checkToken(req.header('token'));
      const body = checkUpdatedLocationValues(req.body);
      const location = await Location.findById(req.params.id) as ILocation;

      if (!location) throw new Error('No location found');

      else if (location.createdBy.toString() === userId) {
        const updated = await Location.findByIdAndUpdate({ _id: req.params.id }, body, { new: true }) as ILocation;
        res.json(updated);

      } else res.status(401).send({ error: 'unauthorized' });
    } else res.status(401).send({ error: 'unauthorized' });
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
        res.status(204).send({ success: `${location.name} deleted.` });

      } else res.status(401).send({ error: 'unauthorized' });
    } else res.status(401).send({ error: 'unauthorized' });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});
export default router;