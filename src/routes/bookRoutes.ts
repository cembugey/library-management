// src/routes/bookRoutes.ts

import express from 'express';
import {
  getBooks,
  getBookById,
  createBook,
} from '../controllers/bookController';

const router = express.Router();

// GET /books
router.get('/', getBooks);

// GET /books/:id
router.get('/:id', getBookById);

// POST /books
router.post('/', createBook);

export default router;
