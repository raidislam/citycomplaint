import { Router } from "express";
import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/role.js";
import { adminTest } from "./admin.controller.js";

const router = Router();

router.get(
  "/test",
  authenticate,
  authorize("ADMIN"),
  adminTest,
);

export default router;