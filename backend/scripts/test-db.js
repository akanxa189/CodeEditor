import 'dotenv/config';
import { setServers, setDefaultResultOrder } from 'dns';
import mongoose from 'mongoose';

setDefaultResultOrder('ipv4first');
setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not set');
  process.exit(1);
}

mongoose
  .connect(uri, { serverSelectionTimeoutMS: 15000 })
  .then((conn) => {
    console.log('OK', conn.connection.host);
    process.exit(0);
  })
  .catch((err) => {
    console.error('FAIL', err.message);
    process.exit(1);
  });
