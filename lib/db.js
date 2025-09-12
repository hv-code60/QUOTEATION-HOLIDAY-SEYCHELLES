
import mongoose from "mongoose";
let cached = global._mongoose || (global._mongoose = { conn: null, promise: null });
export async function dbConnect() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    if (process.env.NEXT_PHASE === "phase-production-build") return null;
    throw new Error("MONGO_URI is missing. Set it in .env.local");
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 20000 }).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
