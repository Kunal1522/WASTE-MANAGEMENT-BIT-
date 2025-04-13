import mongoose from 'mongoose';
let isConnected = false; // Track connection status
const connectDB = async () => {
  if (isConnected) {
    console.log('✅ Already connected to MongoDB');
    return;
  }
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('🚨 MONGODB_URI is not defined in environment variables');
    }
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'test', // optional, set your DB name here
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('✅ MongoDB connected:', db.connection.host);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};
export default connectDB;
