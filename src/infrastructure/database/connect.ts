import mongoose from 'mongoose';
import { requireMongoDbUri } from '../../shared/env';

let cachedConnection: typeof mongoose | null = null;
let cachedPromise: Promise<typeof mongoose> | null = null;

export async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!cachedPromise) {
    const mongodbUri = requireMongoDbUri();
    const opts = {
      bufferCommands: false,
    };

    cachedPromise = mongoose.connect(mongodbUri, opts).then((mongooseInstance: typeof mongoose) => {
      return mongooseInstance;
    });
  }
  
  try {
    cachedConnection = await cachedPromise;
  } catch (e) {
    cachedPromise = null;
    throw e;
  }

  return cachedConnection;
}
