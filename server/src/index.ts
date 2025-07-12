import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
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

    // Apply all middleware, including Apollo Server, to the /graphql endpoint
    app.use(
      '/graphql',
      // 1. CORS must be first to handle cross-origin requests.
      cors({
        origin: [
          'http://localhost:5173',
          'https://your-frontend-url.onrender.com' // IMPORTANT: Replace with your actual frontend URL
        ],
        credentials: true
      }),
      // 2. Body parser must be second to parse the request body.
      bodyParser.json(),
      // 3. Security headers.
      (req, res, next) => {
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
          res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
          next();
      },
      // 4. Apollo Server middleware is last.
      expressMiddleware(server, {
        context: async ({ req }) => ({ token: req.headers.authorization }),
      }),
    );

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