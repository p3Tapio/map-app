import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { IUser } from '../utils/types';

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true, uniqueCaseInsensitive: true, minlength: 5 },
  password: { type: String, required: true },
  locations: [
    { type: Schema.Types.ObjectId, ref: 'Location' },
  ],
  lists: [
    { type: Schema.Types.ObjectId, ref: 'List' },
  ],
  favorites: [
    { type: Schema.Types.ObjectId, ref: 'List' }
  ]
});

userSchema.plugin(uniqueValidator);

export default mongoose.model<IUser>('User', userSchema);
