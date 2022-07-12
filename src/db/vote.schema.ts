import * as mongoose from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

export const VoteSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    votes: { type: Number, required: true },
    date: {
      type: Number,
      default: Date.now,
    },
  },
  { timestamps: true },
);
VoteSchema.plugin(softDeletePlugin);
