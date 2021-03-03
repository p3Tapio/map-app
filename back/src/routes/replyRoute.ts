import express from 'express';
import mongoose from 'mongoose';
import Reply from '../models/replyModel';
import Comment from '../models/commentModel';
import { checkId, checkIdObj, checkNewReply } from '../utils/checks';
import { checkToken } from '../utils/tokens';

const router = express.Router();

router.post('/newreply/:id', async (req, res) => {
  try {
    if (req.header('token') && checkToken(req.header('token'))) {
      const userId = checkToken(req.header('token'));
      const commentId = checkId(req.params.id);
      const reply = checkNewReply(req.body);

      const comment = await Comment.findById(commentId);
      if (!comment) throw new Error('No comment found');

      const newReply = new Reply({
        user: mongoose.Types.ObjectId(userId),
        reply: reply.reply,
        commentId: commentId,
        listId: reply.listId,
      });
      let savedReply = await newReply.save();
      comment.replies = comment.replies.concat(savedReply._id);
      await comment.save();
      savedReply = await savedReply.populate({path: 'user', select:'username'}).execPopulate();
      res.json(savedReply);
    } else res.status(401).json({ error: 'unauthorized' });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});
router.delete('/deletereply/:id', async (req, res) => {
  try {
    if (req.header('token') && checkToken(req.header('token'))) {
      const userId = checkToken(req.header('token'));
      const commentId = checkId(req.params.id);
      const replyId = checkIdObj(req.body);

      const replyToDel = await Reply.findById(replyId);
      const comment = await Comment.findById(commentId);
      if(!replyToDel || !comment) throw new Error('No reply or comment found');

      if(replyToDel.user.toString() === userId) {
        comment.replies = comment.replies.filter(x => !x.equals(replyId));
        await comment.save();
        await Reply.findOneAndRemove({_id: replyId});
        res.send({replyId: replyId});
      } else res.status(401).json({ error: 'unauthorized' });
    } else res.status(401).json({ error: 'unauthorized' });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }

  console.log('req.body', req.body);
});

export default router; 