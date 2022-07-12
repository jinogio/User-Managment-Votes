import * as mongoose from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { Role } from 'src/enums/role.enum';

export const UserSchema = new mongoose.Schema(
  {
    nickname: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: Role.Basic, enum: [Role.Basic, Role.Admin] },
  },
  { timestamps: true },
);
UserSchema.plugin(softDeletePlugin);
