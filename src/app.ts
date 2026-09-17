import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/auth.route.js";
import userRoutes from "./modules/user/user.route.js";
import adminRoutes from "./modules/admin/admin.route.js";



const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());



app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);

app.get("/api/v1", (_req, res) => {
  res.json({
    success: true,
    message: "City Complaint API is running",
    data: {},
  });
});

export default app;

