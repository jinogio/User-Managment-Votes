import * as mongoose from 'mongoose';

export interface Vote extends mongoose.Document {
  from: string;
  to: string;
  votes: number;
  date: number;
}
