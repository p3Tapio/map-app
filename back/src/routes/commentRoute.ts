import express from 'express';
import Comment from '../models/commentModel';
import List from '../models/listModel';
import User from '../models/userModel';
import { checkId, checkNewComment } from '../utils/checks';
import { checkToken } from '../utils/tokens';
import { IComment, IList, IUser } from '../utils/types';

const router = express.Router();

router.post('/newcomment/:id', async (req, res) => {
  try {
    if (req.header('token') && checkToken(req.header('token'))) {
      const listId = req.params.id;
      const userId = checkToken(req.header('token'));
      const body = checkNewComment(req.body);

      const list = await List.findById(listId) as IList;
      const user = await User.findById(userId) as IUser;
      if (!list || !user) throw new Error('List or user error');

      const comment = new Comment({
        user: userId,
        list: listId,
        comment: body.comment,
        replies: [],
        date: Date.now(),
      });

      const newComment = await comment.save();
      list.comments = list.comments.concat(newComment._id);
      user.comments = user.comments.concat(newComment._id);
      await list.save();
      await user.save();

      res.json(newComment);
    } else res.status(401).json({ error: 'unauthorized' });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});
router.get('/comments/:id', async (req, res) => {
  try {
    if (checkId(req.params.id)) {
      const comments = await Comment.find({ list: req.params.id }).populate({ path: 'user', select: 'username' }) as IComment[];
      res.json(comments);
    }
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});


export default router; 
