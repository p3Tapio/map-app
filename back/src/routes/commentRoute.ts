import express from 'express';
import mongoose from 'mongoose';
import Comment from '../models/commentModel';
import List from '../models/listModel';
import Reply from '../models/replyModel';
import User from '../models/userModel';
import { checkId, checkIdObj, checkNewComment, checkUpdatedComment } from '../utils/checks';
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
      const comments = await Comment.find({ list: req.params.id })
        .populate([
          { path: 'user', select: 'username' },
          { path: 'replies', populate: { path: 'user', select: 'username' } }
        ]) ;
      res.json(comments);
    }
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});
router.put('/update/:id', async (req, res) => {
  try {
    if (req.header('token') && checkToken(req.header('token'))) {
      const userId = checkToken(req.header('token'));
      const body = checkUpdatedComment(req.body);
      const comment = await Comment.findById(req.params.id);
      if (!comment) throw new Error('No comment found.');
      else if (comment.user.toString() === userId) {
        const withEdited = {...body, edited: new Date()};
        const updated = await Comment.findByIdAndUpdate({ _id: req.params.id }, withEdited, { new: true });
        res.json(updated);
      } else res.status(401).json({ error: 'unauthorized' });
    } else res.status(401).json({ error: 'unauthorized' });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});
router.delete('/delete/:id', async (req, res) => {
  try {
    if (req.header('token') && checkToken(req.header('token'))) {
      const userId = checkToken(req.header('token'));
      const listId = checkId(req.params.id);
      const commentId = checkIdObj(req.body);

      const comment = await Comment.findById(commentId) as IComment;
      const list = await List.findById(listId);
      if (!comment || !list) throw new Error('No comment or list found');

      if (comment.user.toString() === userId || list.createdBy.toString() === userId) {
        const user = await User.findById(userId);
        if (user) {
          user.comments = user.comments.filter(x => !x.equals(commentId));
          list.comments = list.comments.filter(x => !x.equals(commentId));
          await user.save();
          await list.save();
          await Comment.findOneAndRemove({ _id: commentId });
          await Reply.deleteMany({commentId: commentId});
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
router.post('/star/:id', async (req, res) => {
  try {
    if (req.header('token') && checkToken(req.header('token'))) {
      const userId = checkToken(req.header('token'));
      const commentId = checkId(req.params.id);
      let comment = await Comment.findById(commentId);
      if(comment && userId) {
        if(!comment.stars.some(x => (x.equals(userId)))) {
          comment.stars = comment.stars.concat(mongoose.Types.ObjectId(userId));
        } else {
          comment.stars = comment.stars.filter(x => !x.equals(userId));
        }
        await comment.save();
        comment = await comment.populate([
          { path: 'user', select: 'username' },
          { path: 'replies', populate: { path: 'user', select: 'username' } }
        ]).execPopulate();
        res.json(comment);
      } else throw new Error('Comment or userId error');
    } else res.status(401).json({ error: 'unauthorized' });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});
export default router; 
