import { Schema, model } from 'mongoose';
import { IComment } from '../utils/types';

const commentSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  list: { type: Schema.Types.ObjectId, ref: 'List', required: true },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Reply',
  }],
  edited: { type: Date }, 
});

commentSchema.set('versionKey', false);
export default model<IComment>('Comment', commentSchema);