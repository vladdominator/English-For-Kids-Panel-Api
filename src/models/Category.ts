import { SavedCategory } from './../typesCategory';
import { Schema, model } from 'mongoose';
const uniqueValidator = require('mongoose-unique-validator');

const chema = new Schema({
  name: { type: String, required: true },
  words: {type: Number, default: 0},
  _deletedAt: { type: Date, default: null },
});
chema.plugin(uniqueValidator, {
  type: 'mongoose-unique-validator',
  message: 'Error, expected {PATH} to be unique.',
});
export default model<SavedCategory>('Category', chema);
