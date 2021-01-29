import express, { Request, Response } from 'express';
import List from '../models/listModel';
import User from '../models/userModel';
import { IList, IUser } from '../utils/types';
import { checkNewListValues } from '../utils/checks';
import { checkToken } from '../utils/tokens';

const router = express.Router();

router.get('/allpublic', async (_req: Request, res: Response) => {
  const lists = await List.find({public: true}).populate('locations');
  res.json(lists);
});

router.get('/user', async (req: Request, res: Response) => {
  try {
    if (req.header('token') && checkToken(req.header('token'))) { // checkToken testaus jotta 401 muuten 400
      const userId = checkToken(req.header('token'));
      const lists = await List.find({ createdBy: userId }).populate('locations');
      res.json(lists);
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
        createdBy: userId,
        defaultview: {
          lat: newList.defaultview.lat,
          lng: newList.defaultview.lng,
          zoom: newList.defaultview.zoom,
        },
        public: newList.public,
      });
      const savedList: IList = await list.save();
      user.lists = user.lists.concat(savedList);
      await user.save();
      res.status(200).json(savedList);
    } else throw new Error('No token');
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});


export default router; 