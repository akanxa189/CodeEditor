import { setServers, setDefaultResultOrder } from 'dns';
import mongoose from 'mongoose';

// Windows often fails SRV lookups with the system DNS — use public resolvers
setDefaultResultOrder('ipv4first');
setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set in .env');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error('Server will keep running — fix MONGODB_URI in .env and restart.');
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Retrying in 5s...');
  setTimeout(connectDB, 5000);
});

export const isDbConnected = () => mongoose.connection.readyState === 1;

export default connectDB;
