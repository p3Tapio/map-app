import { Schema, model } from 'mongoose';
import { ICommentReply } from '../utils/types';

const replySchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reply: { type: String, required: true },
  date: { type: Date, default: Date.now },
  commentId: { type: Schema.Types.ObjectId, ref: 'Comment', required: true },
  listId: { type: Schema.Types.ObjectId, ref: 'List', required: true},
});

replySchema.set('versionKey', false);
export default model<ICommentReply>('Reply', replySchema);
