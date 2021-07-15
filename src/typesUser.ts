import { Document } from 'mongoose';

export interface SavedUser extends Document {
  email: string;
  password: string;
}