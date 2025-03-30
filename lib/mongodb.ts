import { MongoClient } from 'mongodb';

// Safely check for MongoDB URI
const uri = process.env.MONGODB_URI || '';
if (!uri) {
  console.error('Missing MONGODB_URI environment variable. Please check your .env.local file or Vercel environment variables.');
}

// Enhanced connection options
const options = {
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 30000,
  maxPoolSize: 50,
  retryWrites: true,
  w: 'majority',
};

let client;
let clientPromise: Promise<MongoClient>;

// Connection function with retry logic
const connectWithRetry = async (uri: string, options: any, retries = 5, delay = 5000): Promise<MongoClient> => {
  try {
    const client = new MongoClient(uri, options);
    return await client.connect();
  } catch (error) {
    if (retries <= 0) {
      console.error('Failed to connect to MongoDB after multiple retries:', error);
      throw error;
    }
    
    console.log(`MongoDB connection attempt failed. Retrying in ${delay}ms...`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return connectWithRetry(uri, options, retries - 1, delay);
  }
};

// For development environment - use global variable to preserve connection across HMR
if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = connectWithRetry(uri, options);
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = connectWithRetry(uri, options);
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
