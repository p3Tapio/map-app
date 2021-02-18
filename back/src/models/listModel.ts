import { Schema, model } from 'mongoose';
import { IList } from '../utils/types';


const listSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  defaultview: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    zoom: { type: Number, required: true },
  },
  country: { type: String, required: true },
  place: { type: String, required: true },
  public: { type: Boolean, required: true },
  locations: [{
    type: Schema.Types.ObjectId,
    ref: 'Location',
  }],
  favoritedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  date: { type: Date, default: Date.now },
});

listSchema.set('versionKey', false);
export default model<IList>('List', listSchema);
