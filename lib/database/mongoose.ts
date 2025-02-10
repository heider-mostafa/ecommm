/* eslint-disable no-unused-vars */
/* eslint-disable no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable no-prototype-builtins */

import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose

if(!cached) {
  cached = (global as any).mongoose = { 
    conn: null, promise: null 
  }
}

export const connectToDatabase = async () => {
  try {
    console.log("Attempting to connect to the database...");

    if (cached.conn) return cached.conn;

    if (!MONGODB_URL) throw new Error('Missing MONGODB_URL');

    cached.promise = 
      cached.promise || 
      mongoose.connect(MONGODB_URL, { 
        dbName: 'imaginify', bufferCommands: false 
      });

    console.log("Waiting for connection...");

    cached.conn = await cached.promise;

    console.log("Connected to db");

    return cached.conn;
  } catch (error) {
    console.error("Database connection error:", error); // Log the error
    throw error; // Rethrow the error if needed
  }
}