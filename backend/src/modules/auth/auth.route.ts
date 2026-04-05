import { Router } from "express";
import { getCurrentUser, loginUser, registerUser } from "./auth.service.js";

export const authRouter = Router();

authRouter.post("/register", (req, res) => {
  registerUser(req.body)
    .then((result) => {
    res.status(201).json({
      success: true,
      data: result
    });
    })
    .catch((error) => {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Register gagal"
    });
    });
});

authRouter.post("/login", (req, res) => {
  loginUser(req.body)
    .then((result) => {
    res.json({
      success: true,
      data: result
    });
    })
    .catch((error) => {
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Login gagal"
    });
    });
});

authRouter.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "").trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token tidak ditemukan"
    });
  }

  return getCurrentUser(token).then((user) => {
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Session tidak valid"
      });
    }

    return res.json({
      success: true,
      data: user
    });
  });
});
