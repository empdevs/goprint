import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { authRouter } from "./modules/auth/auth.route.js";
import { copyShopsRouter } from "./modules/copy-shops/copy-shops.route.js";
import { feedbacksRouter } from "./modules/feedbacks/feedbacks.route.js";
import { healthRouter } from "./modules/health/health.route.js";
import { ordersRouter } from "./modules/orders/orders.route.js";
import { uploadsRouter } from "./modules/uploads/uploads.route.js";
import { usersRouter } from "./modules/users/users.route.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.FRONTEND_URL
    })
  );
  app.use(express.json({ limit: "10mb" }));

  app.get("/", (_req, res) => {
    res.json({
      app: "GoPrint API",
      status: "ok"
    });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/copy-shops", copyShopsRouter);
  app.use("/api/feedbacks", feedbacksRouter);
  app.use("/api/health", healthRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/uploads", uploadsRouter);
  app.use("/api/users", usersRouter);

  return app;
}
