import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { healthRouter } from "./modules/health/health.route.js";
import { ordersRouter } from "./modules/orders/orders.route.js";

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

  app.use("/api/health", healthRouter);
  app.use("/api/orders", ordersRouter);

  return app;
}
