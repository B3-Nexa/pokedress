import mongoose from 'mongoose';
import { config } from './env.js';

export async function connectDatabase(uri?: string): Promise<typeof mongoose> {
  const mongoUri = uri || config.mongodbUri;
  try {
    const conn = await mongoose.connect(mongoUri);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
