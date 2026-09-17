import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.js";
import { prisma } from "../../lib/prisma.js";

export const getMe = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user?.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        errors: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: user,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      errors: [],
    });
  }
};