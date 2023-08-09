import { Document, Schema, Model, model } from 'mongoose';
import { User } from './userModel';

export enum TokenType {
  verify = 'verify',
  reset = 'reset'
};

export interface Token extends Document {
  user: string | User,
  token: string,
  type: TokenType,
  createdAt: Date
};

const tokenSchema = new Schema<Token>({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  type: { type: String, enum: Object.values(TokenType), required: true } ,
  createdAt: { type: Date, default: new Date() }
});

/* Expiry time for schema taken from https://stackoverflow.com/questions/14597241/setting-expiry-time-for-a-collection-in-mongodb-using-mongoose */
tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

export const Token: Model<Token> = model<Token>('token', tokenSchema);