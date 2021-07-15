import { Document } from 'mongoose';

export interface SavedCards extends Document {
  name: string;
  categoryName: string;
  translation: string;
  sound: string;
  img: string;
  _deletedAt: Date;
}
