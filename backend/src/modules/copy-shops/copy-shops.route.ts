import { Router } from "express";
import { listActiveCopyShops } from "./copy-shops.service.js";

export const copyShopsRouter = Router();

copyShopsRouter.get("/", async (_req, res) => {
  try {
    const shops = await listActiveCopyShops();

    res.json({
      success: true,
      data: shops
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Gagal mengambil daftar gerai fotokopi"
    });
  }
});
