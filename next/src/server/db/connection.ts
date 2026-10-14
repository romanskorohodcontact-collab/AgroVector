import mongoose from "mongoose";

const MONGODB_URI = process.env.DATABASE_URL ?? "mongodb://127.0.0.1:27017/agrorunok";

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalForMongo = globalThis as unknown as { mongooseCache?: Cached };

const cached: Cached = globalForMongo.mongooseCache ?? {
  conn: null,
  promise: null,
};
globalForMongo.mongooseCache = cached;

export async function connectDb(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((conn) => {
      cached.conn = conn;
      return conn;
    });
  }
  try {
    return await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}
