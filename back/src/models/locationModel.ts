import { Schema, model } from 'mongoose';
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
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  list: { type: Schema.Types.ObjectId, ref: 'List', required: true},
  date: { type: Date, default: Date.now },
});
locationSchema.set('versionKey', false);

export default model<ILocation>('Location', locationSchema);