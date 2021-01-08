import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { checkUserValues } from '../utils/checks';
import { createToken } from '../utils/tokens';
import User from '../models/userModel';
import { IUser } from '../utils/types';

const router = express.Router();

router.post('/register', (req: Request, res: Response) => {
  try {
    const newUser = checkUserValues(req.body);
    const { username, password } = newUser;
    const hashed = bcrypt.hashSync(password, 10);

    const user = new User({
      _id: new mongoose.Types.ObjectId,
      username, password: hashed
    });

    user.save().then((result) => {
      const token = createToken(result.username, result.id);
      res.json({ id: result.id, username: result.username, token: token });
    }).catch((e) => {
      const errMsg: string = (e as Error).message;
      res.status(400).json({ error: errMsg });
    });

  } catch (err) {
    res.status(400).send((err as Error).message);
  }
});
// TODO fix: 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/login', async (req: Request, res: Response) => {
  try {
    const body = checkUserValues(req.body);
    const user = await User.findOne({ username: body.username }) as IUser;
    const passCorrect: boolean = user === null ? false : await bcrypt.compare(body.password, user.password);

    if (passCorrect) {
      const token = createToken(user.username, user._id);
      res.json({ id: user.id, username: user.username, token: token });
    } else res.status(401).json({ error: 'wrong username or password' });

  } catch (err) {
    res.status(400).send((err as Error).message);
  }
});

export default router; 
