import { Router } from "express";
import { getCurrentUser } from "../auth/auth.service.js";
import {
  buildOrderSummary,
  createOrder,
  deleteOrder,
  getOrderById,
  listOrders,
  updateOrder
} from "./orders.service.js";

export const ordersRouter = Router();

function getRequestUser(authHeader?: string) {
  const token = authHeader?.replace("Bearer ", "").trim();

  if (!token) {
    return null;
  }

  return getCurrentUser(token);
}

ordersRouter.get("/", async (req, res) => {
  try {
    const user = await getRequestUser(req.headers.authorization);

    res.json({
      success: true,
      data: await listOrders(user ?? undefined)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Gagal mengambil daftar pesanan"
    });
  }
});

ordersRouter.post("/preview", (req, res) => {
  const summary = buildOrderSummary(req.body);

  res.json({
    success: true,
    data: summary
  });
});

ordersRouter.get("/:id", async (req, res) => {
  const order = await getOrderById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Pesanan tidak ditemukan"
    });
  }

  return res.json({
    success: true,
    data: order
  });
});

ordersRouter.post("/", async (req, res) => {
  const user = await getRequestUser(req.headers.authorization);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Login dibutuhkan untuk membuat pesanan"
    });
  }

  try {
    const order = await createOrder(user, req.body);

    return res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Gagal membuat pesanan"
    });
  }
});

ordersRouter.patch("/:id", async (req, res) => {
  try {
    const order = await updateOrder(req.params.id, req.body);

    return res.json({
      success: true,
      data: order
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : "Gagal memperbarui pesanan"
    });
  }
});

ordersRouter.delete("/:id", async (req, res) => {
  try {
    const removedOrder = await deleteOrder(req.params.id);

    return res.json({
      success: true,
      data: removedOrder
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : "Gagal menghapus pesanan"
    });
  }
});
