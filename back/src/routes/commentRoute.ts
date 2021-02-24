import express from 'express';
import Comment from '../models/commentModel';
import List from '../models/listModel';
import User from '../models/userModel';
import { checkId, checkIdObj, checkNewComment } from '../utils/checks';
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
router.delete('/delete/:id', async (req, res) => { 
  try {
    if (req.header('token') && checkToken(req.header('token'))) {
      const userId = checkToken(req.header('token'));
      const listId = checkId(req.params.id);
      const commentId = checkIdObj(req.body);  // TODO

      const comment = await Comment.findById(commentId) as IComment;
      if (!comment) throw new Error('No comment found');

      if (comment.user.toString() === userId) { // tekijätesti
        const list = await List.findById(listId);
        const user = await User.findById(userId);
        if (list && user) {
          user.comments = user.comments.filter(x => !x.equals(commentId));
          list.comments = list.comments.filter(x => !x.equals(commentId));
          await user.save();
          await list.save();
          await Comment.findOneAndRemove({ _id: commentId});
          res.status(200).json({ success: `comment deleted`, id: commentId });
        }
      } else {
        res.status(401).json({ error: 'unauthorized' });
      }
    } else res.status(401).json({ error: 'unauthorized' });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});


export default router; 