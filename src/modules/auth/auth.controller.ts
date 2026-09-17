import type { Request, Response } from "express";
import { loginUser, registerUser } from "./auth.service.js";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
      errors: [],
    });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginUser(
      req.body.email,
      req.body.password,
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error instanceof Error
        ? error.message
        : "Something went wrong",
      errors: [],
    });
  }
};