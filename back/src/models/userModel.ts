import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { IUser } from '../utils/types';

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true, uniqueCaseInsensitive: true, minlength: 5 },
  password: { type: String, required: true },
  locations: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  ]
});

userSchema.plugin(uniqueValidator);

export default mongoose.model<IUser>('User', userSchema);
