// src/index.ts

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import bookRoutes from './routes/bookRoutes';
import errorHandler from './middlewares/errorHandler';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/books', bookRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('Library Management API is working!');
});

// Error Handling Middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
