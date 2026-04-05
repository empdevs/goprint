import { Router } from "express";
import { db } from "../../config/database.js";

export const healthRouter = Router();

healthRouter.get("/", async (_req, res) => {
  try {
    await db.query("SELECT 1");

    res.json({
      success: true,
      message: "API and database connection are healthy"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
