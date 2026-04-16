import { Router } from "express";
import { createFeedback, listFeedbacks } from "./feedbacks.service.js";

export const feedbacksRouter = Router();

feedbacksRouter.get("/", async (_req, res) => {
  try {
    const feedbacks = await listFeedbacks();

    res.json({
      success: true,
      data: feedbacks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Gagal mengambil feedback"
    });
  }
});

feedbacksRouter.post("/", async (req, res) => {
  try {
    const feedback = await createFeedback(req.body);

    res.status(201).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Gagal mengirim feedback"
    });
  }
});
