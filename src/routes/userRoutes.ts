// src/routes/userRoutes.ts

import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  borrowBook,
  returnBook,
} from '../controllers/userController';
import validate from '../middlewares/validate';
import { createUserSchema } from '../validators/userValidator';
import { returnBookSchema } from '../validators/bookValidator';

const router = express.Router();

// GET /users
router.get('/', getUsers);

// GET /users/:id
router.get('/:id', getUserById);

// POST /users
router.post('/', validate(createUserSchema), createUser);

// POST /users/:userId/borrow/:bookId
router.post('/:userId/borrow/:bookId', borrowBook);

// POST /users/:userId/return/:bookId
router.post('/:userId/return/:bookId', validate(returnBookSchema), returnBook);

export default router;
