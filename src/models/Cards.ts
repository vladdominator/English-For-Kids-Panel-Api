import { SavedCards } from './../typesCards';

import { Schema, model } from 'mongoose';

const chema = new Schema({
  categoryName: { type: String, required: true },
  name: { type: String, required: true },
  translation: { type: String, required: true },
  sound: { type: String, required: true },
  img: { type: String, required: true },
  _deletedAt: { type: Date, default: null },
});
export default model<SavedCards>('Cards', chema);
