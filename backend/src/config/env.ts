import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/pokedress',
  jwtSecret: process.env.JWT_SECRET || 'supersecretdevkey123456789',
  nodeEnv: process.env.NODE_ENV || 'development',
};
