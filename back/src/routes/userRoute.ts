import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { checkUserValues } from '../utils/checks';
import {  createToken } from '../utils/tokens';
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
      res.json({ id: result.id as string, username: result.username, token: token, favorites: [] });
    }).catch((e) => {
      const errMsg: string = (e as Error).message;
      res.status(400).json({ error: errMsg });
    });

  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const body = checkUserValues(req.body);
    const user: IUser | null = await User.findOne({ username: body.username }) as IUser;
    const passCorrect: boolean = user === null ? false : await bcrypt.compare(body.password, user.password);

    if (passCorrect && user) {
      const token = createToken(user.username, user._id.toString());
      res.json({ id: user.id as string, username: user.username, token: token, favorites: user.favorites });
    } else res.status(401).json({ error: 'wrong username or password' });

  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

export default router; 
