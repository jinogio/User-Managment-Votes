import * as mongoose from 'mongoose';
import { Role } from 'src/enums/role.enum';

export interface User extends mongoose.Document {
  nickname: string;
  firstname: string;
  lastname: string;
  password: string;
  role: Role;
}
