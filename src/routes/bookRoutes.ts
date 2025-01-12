// src/routes/bookRoutes.ts

import express from 'express';
import {
  getBooks,
  getBookById,
  createBook,
} from '../controllers/bookController';
import validate from '../middlewares/validate';
import { createBookSchema } from '../validators/bookValidator';

const router = express.Router();

// GET /books
router.get('/', getBooks);

// GET /books/:id
router.get('/:id', getBookById);

// POST /books
router.post('/', validate(createBookSchema), createBook);

export default router;
