import { Router } from "express";
import { listUsers } from "./users.service.js";

export const usersRouter = Router();

usersRouter.get("/", async (_req, res) => {
  try {
    const users = await listUsers();

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Gagal mengambil user"
    });
  }
});
