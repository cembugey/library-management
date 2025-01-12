// src/controllers/bookController.ts

import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/client';

export const getBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const books = await prisma.book.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

export const getBookById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const bookId = parseInt(req.params.id, 10);

  try {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        borrows: true,
      },
    });

    if (!book) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }

    // Calculate average score
    const scoredBorrows = book.borrows.filter(
      (borrow) => borrow.userScore !== null
    );
    let averageScore: number | string = -1;

    if (scoredBorrows.length > 0) {
      const totalScore = scoredBorrows.reduce(
        (acc, borrow) => acc + (borrow.userScore || 0),
        0
      );
      averageScore = (totalScore / scoredBorrows.length).toFixed(2);
    }

    const response = {
      id: book.id,
      name: book.name,
      score: averageScore,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;

  try {
    await prisma.book.create({
      data: { name },
    });
    res.status(201).send('');
  } catch (error) {
    next(error);
  }
};
