import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/schema';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable');
}

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🔌 Successfully connected to MongoDB');

    await server.start();

    app.use(cors());
    app.use(
      '/graphql',
      expressMiddleware(server, {
        context: async ({ req }) => ({ token: req.headers.authorization }),
      }),
    );

    // For local development
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

if (!process.env.FUNCTION_NAME) {
  startServer();
}

export default app;
export { resolvers, typeDefs };
