import express, { Request, Response } from 'express';
import List from '../models/listModel';
import User from '../models/userModel';
import Location from '../models/locationModel';
import { IList, IUser } from '../utils/types';
import { checkNewListValues, checkUpdatedListValues } from '../utils/checks';
import { checkToken } from '../utils/tokens';

const router = express.Router();

router.get('/allpublic', async (_req: Request, res: Response) => {
  const lists = await List.find({ public: true })
    .populate('locations createdBy', 'username name address description coordinates category imageLink list createdBy');
  res.status(200).json(lists);
});

router.get('/user', async (req: Request, res: Response) => {
  try {
    if (req.header('token') && checkToken(req.header('token'))) {
      const userId = checkToken(req.header('token'));
      const lists = await List.find({ createdBy: userId })
        .populate('locations createdBy', 'username name address description coordinates category imageLink list createdBy');
      res.status(200).json(lists);
    } else res.status(401).json({ error: 'unauthorized' });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

router.post('/create', async (req: Request, res: Response) => {
  try {
    if (req.header('token') && checkToken(req.header('token'))) {
      const userId = checkToken(req.header('token'));
      const newList = checkNewListValues(req.body);
      const user = await User.findById(userId) as IUser;
      const list = new List({
        name: newList.name,
        description: newList.description,
        createdBy: userId,
        defaultview: {
          lat: newList.defaultview.lat,
          lng: newList.defaultview.lng,
          zoom: newList.defaultview.zoom,
        },
        country: newList.country,
        place: newList.place,
        public: newList.public,
      });
      const savedList: IList = await list.save();
      user.lists = user.lists.concat(savedList);
      await user.save();
      res.status(200).json(savedList);
    } else res.status(401).send({ error: 'unauthorized' });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

router.put('/update/:id', async (req: Request, res: Response) => {
  try {
    if (req.header('token') && checkToken(req.header('token'))) {
      const userId = checkToken(req.header('token'));
      const body = checkUpdatedListValues(req.body);
      const list = await List.findById(req.params.id) as IList;

      if (!list) throw new Error('No list found.');
      else if (list.createdBy.toString() === userId) {
        const updated = await List.findByIdAndUpdate({ _id: req.params.id }, body, { new: true }) as IList;
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
      const list = await List.findById(req.params.id) as IList;
      if (!list) throw new Error('No list found');
      if (list.createdBy.toString() === userId) {
        await List.findOneAndRemove({ _id: req.params.id });
        await Location.deleteMany({ list: req.params.id });
        res.status(204).send({ success: `${list.name} deleted` });
      } else {
        res.status(401).send({ error: 'unauthorized' });
      }
    } else res.status(401).send({ error: 'unauthorized' });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

export default router; 