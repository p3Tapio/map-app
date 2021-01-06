import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { toNewUser } from '../utils/checks';
import User from '../models/userModel';

const router = express.Router();

router.post('/register', (req: Request, res: Response) => {
  try {
    const newUser = toNewUser(req.body);
    const { username, password } = newUser;
    const hashed = bcrypt.hashSync(password, 10);

    const user = new User({
      _id: new mongoose.Types.ObjectId,
      username, passwordHashed: hashed
    });

    user.save().then((result) => {
      // TODO token?
      res.json({ id: result.id, username: result.username });
    }).catch((e) => {
      const errMsg: string = (e as Error).message;
      // throw new Error(errMsg); 
      res.status(400).json({ error: errMsg });
    });

  } catch (err) {
    res.status(400).send((err as Error).message);
  }
});

export default router; 
