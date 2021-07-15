import { Document } from 'mongoose';

export interface SavedCategory extends Document {
  name: string;
  words: number;
  _deletedAt: Date;
}