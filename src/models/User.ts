import { SavedUser } from './../typesUser';
import { Schema, model, Types } from 'mongoose';

const chema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  links: [{ type: Types.ObjectId, ref: 'Link' }],
});
export default model<SavedUser>('User', chema);
