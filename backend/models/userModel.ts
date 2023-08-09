import { Document, Schema, model, Model } from "mongoose";

/* Mongoose with typescript setup adapted from https://mongoosejs.com/docs/typescript.html */
export interface User extends Document {
  _id: Schema.Types.ObjectId,
  username: string,
  email: string,
  password: string,
  isVerified: boolean
}

const userSchema = new Schema<User>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false }
});

export const User: Model<User> = model<User>('User', userSchema);