import { Router } from "express";
import { login, logout, refreshToken, register } from "./auth.controller.js";
import { registerSchema, loginSchema, refreshTokenSchema } from "./auth.validation.js";
import { validate } from "../../middlewares/validate.js";

const router = Router();

router.post("/register", validate(registerSchema), register);

router.post(
  "/login",
  validate(loginSchema),
  login,
);

router.post(
  "/refresh-token",
  validate(refreshTokenSchema),
  refreshToken,
);

router.post(
  "/logout",
  validate(refreshTokenSchema),
  logout,
);

export default router;