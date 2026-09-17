import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.js";

export const adminTest = (
  req: AuthRequest,
  res: Response,
) => {
  return res.status(200).json({
    success: true,
    message: "Admin access granted",
    data: {
      userId: req.user?.userId,
      role: req.user?.role,
    },
  });
};