// src/controllers/userController.ts

import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/client';

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = parseInt(req.params.id, 10);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        borrows: {
          where: {
            returnedAt: null,
          },
          include: {
            book: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Fetch past borrows with scores
    const pastBorrows = await prisma.borrow.findMany({
      where: {
        userId: userId,
        returnedAt: { not: null },
        userScore: { not: null },
      },
      include: {
        book: true,
      },
    });

    const response = {
      id: user.id,
      name: user.name,
      books: {
        past: pastBorrows.map((borrow) => ({
          name: borrow.book.name,
          userScore: borrow.userScore,
        })),
        present: user.borrows.map((borrow) => ({
          name: borrow.book.name,
        })),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: { name },
    });
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const borrowBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = parseInt(req.params.userId, 10);
  const bookId = parseInt(req.params.bookId, 10);

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check if book exists
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }

    // Check if the book is already borrowed
    const existingBorrow = await prisma.borrow.findFirst({
      where: {
        bookId: bookId,
        returnedAt: null,
      },
    });

    if (existingBorrow) {
      res
        .status(400)
        .json({ error: 'Book is already borrowed by another user' });
      return;
    }

    // Create a borrow record
    await prisma.borrow.create({
      data: {
        userId,
        bookId,
      },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const returnBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = parseInt(req.params.userId, 10);
  const bookId = parseInt(req.params.bookId, 10);
  const { score } = req.body;

  try {
    // Find the borrow record
    const borrow = await prisma.borrow.findFirst({
      where: {
        userId,
        bookId,
        returnedAt: null,
      },
    });

    if (!borrow) {
      return res
        .status(400)
        .json({ error: 'Borrow record not found or already returned' });
    }

    // Update the borrow record
    await prisma.borrow.update({
      where: { id: borrow.id },
      data: {
        returnedAt: new Date(),
        userScore: score,
      },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
