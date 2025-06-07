import { UserProvider } from '@/common/enums/user-provider.enum';
import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  provider: { type: String, required: true, enum: Object.values(UserProvider) },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});
