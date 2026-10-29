import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

export async function setup() {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.TEST_MONGODB_URI = uri;
}

export async function teardown() {
  if (mongoServer) {
    await mongoServer.stop();
  }
}
