import { Router } from "express";
import { getCurrentUser } from "../auth/auth.service.js";
import { createCopyShopAccount, listUsers, updateUserProfile } from "./users.service.js";

export const usersRouter = Router();

async function getRequestUser(authHeader?: string) {
  const token = authHeader?.replace("Bearer ", "").trim();

  if (!token) {
    return null;
  }

  return getCurrentUser(token);
}

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

usersRouter.post("/copy-shops", async (req, res) => {
  const user = await getRequestUser(req.headers.authorization);

  if (!user || user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Hanya admin yang dapat membuat akun copy shop"
    });
  }

  try {
    const createdUser = await createCopyShopAccount(req.body);

    return res.status(201).json({
      success: true,
      data: createdUser
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Gagal membuat akun copy shop"
    });
  }
});

usersRouter.patch("/me", async (req, res) => {
  const user = await getRequestUser(req.headers.authorization);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Login dibutuhkan"
    });
  }

  try {
    const updatedUser = await updateUserProfile(user.id, req.body);

    return res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Gagal memperbarui profil"
    });
  }
});
