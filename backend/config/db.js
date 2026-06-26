import { setServers, setDefaultResultOrder } from 'dns';
import mongoose from 'mongoose';

// Windows often fails SRV lookups with the system DNS — use public resolvers
setDefaultResultOrder('ipv4first');
setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set in environment');
    return;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log(`MongoDB connected: ${cached.conn.connection.host}`);
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error(`MongoDB connection error: ${error.message}`);
    if (!process.env.VERCEL) {
      console.error('Server will keep running — fix MONGODB_URI and restart.');
    }
    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  cached.conn = null;
  cached.promise = null;
  if (!process.env.VERCEL) {
    console.warn('MongoDB disconnected. Retrying in 5s...');
    setTimeout(connectDB, 5000);
  }
});

export const isDbConnected = () => mongoose.connection.readyState === 1;

export default connectDB;
