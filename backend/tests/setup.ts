import mongoose from 'mongoose';

export async function setupTestDb(): Promise<void> {
  const uri = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/pokedress_test';
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
}

export async function teardownTestDb(): Promise<void> {
  // Connection cleanup handled per test file or on process exit
}

export async function clearTestDb(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
}
