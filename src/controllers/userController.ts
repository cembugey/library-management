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
