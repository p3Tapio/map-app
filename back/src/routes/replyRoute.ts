import express from "express";
import mongoose from "mongoose";
import Reply from "../models/replyModel";
import Comment from "../models/commentModel";
import List from "../models/listModel";
import {
  checkDeleteReplyBody,
  checkId,
  checkNewReply,
  checkUpdatedReply,
} from "../utils/checks";
import { checkToken } from "../utils/tokens";

const router = express.Router();

router.post("/newreply/:id", async (req, res) => {
  try {
    if (req.header("token") && checkToken(req.header("token"))) {
      const userId = checkToken(req.header("token"));
      const commentId = checkId(req.params.id);
      const reply = checkNewReply(req.body);

      const comment = await Comment.findById(commentId);
      if (!comment) throw new Error("No comment found");

      const newReply = new Reply({
        user: new mongoose.Types.ObjectId(userId),
        reply: reply.reply,
        commentId: commentId,
        listId: reply.listId,
      });
      let savedReply = await newReply.save();
      comment.replies = comment.replies.concat(savedReply._id);
      await comment.save();
      savedReply = await savedReply
        .populate({ path: "user", select: "username" })
        .execPopulate();
      res.json(savedReply);
    } else res.status(401).json({ error: "unauthorized" });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});
router.put("/updatereply/:id", async (req, res) => {
  try {
    if (req.header("token") && checkToken(req.header("token"))) {
      const userId = checkToken(req.header("token"));
      const replyId = checkId(req.params.id);
      const body = checkUpdatedReply(req.body);

      const replyToEdit = await Reply.findById(replyId);
      if (!replyToEdit) throw new Error("No reply found");

      if (replyToEdit.user.toString() === userId) {
        const withEdited = { ...body, edited: new Date() };
        let updated = await Reply.findByIdAndUpdate(
          { _id: replyId },
          withEdited,
          { new: true }
        );
        if (updated) {
          // @ts-ignore
          const populated = updated.populate({
            path: "user",
            select: "username",
          });
          // @ts-ignore
          updated = await populated.execPopulate();
          res.json(updated);
        } else throw new Error("Update fail.");
      } else res.status(401).json({ error: "unauthorized" });
    } else res.status(401).json({ error: "unauthorized" });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});
router.delete("/deletereply/:id", async (req, res) => {
  try {
    if (req.header("token") && checkToken(req.header("token"))) {
      const userId = checkToken(req.header("token"));
      const commentId = checkId(req.params.id);
      const body = checkDeleteReplyBody(req.body);

      const replyToDel = await Reply.findById(body.replyId);
      const comment = await Comment.findById(commentId);
      const list = await List.findById(body.listId);

      if (!replyToDel || !comment || !list)
        throw new Error("No reply, list or comment found");

      if (
        replyToDel.user.toString() === userId ||
        list.createdBy.toString() === userId
      ) {
        comment.replies = comment.replies.filter(
          (x) => !x.equals(body.replyId)
        );
        await comment.save();
        await Reply.findOneAndRemove({ _id: body.replyId });
        res.send({ replyId: body.replyId });
      } else res.status(401).json({ error: "unauthorized" });
    } else res.status(401).json({ error: "unauthorized" });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

export default router;
