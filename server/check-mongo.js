import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: './.env' });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not set in server/.env');
  process.exit(2);
}

(async () => {
  try {
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      retryReads: true,
      w: 'majority',
      family: 4
    });
    console.log('Connected to MongoDB Atlas successfully');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Failed to connect to MongoDB Atlas:');
    console.error(err);
    process.exit(1);
  }
})();
