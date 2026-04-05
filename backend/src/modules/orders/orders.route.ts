import { Router } from "express";
import { buildOrderSummary } from "./orders.service.js";

export const ordersRouter = Router();

ordersRouter.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Orders endpoint is ready",
    data: []
  });
});

ordersRouter.post("/preview", (req, res) => {
  const summary = buildOrderSummary(req.body);

  res.json({
    success: true,
    data: summary
  });
});
