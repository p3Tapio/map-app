import mongoose, { Schema } from 'mongoose';
import { ILocation } from '../utils/types';

const locationSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  description: String,
  category: { type: String, required: true },
  imageLink: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
locationSchema.set('versionKey', false);

export default mongoose.model<ILocation>('Location', locationSchema);