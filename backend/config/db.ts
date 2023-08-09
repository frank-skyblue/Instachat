import { MongoClient } from 'mongodb';
import mongoose from "mongoose";

export const connectDB = async (): Promise<MongoClient> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn.connection.getClient() as MongoClient;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

export const closeDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}