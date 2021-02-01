import { Schema, model } from 'mongoose';
import { IList, List } from '../utils/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listSchemaFields: Record<keyof List, any> = {
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
  }]
};
const listSchema = new Schema(listSchemaFields);
listSchema.set('versionKey', false);
export default model<IList>('List', listSchema);
