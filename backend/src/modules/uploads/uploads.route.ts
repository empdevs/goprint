import { Router } from "express";
import { uploadDocument } from "../../services/blob/blob.service.js";

export const uploadsRouter = Router();

uploadsRouter.post("/", async (req, res) => {
  try {
    const { fileName, contentType, base64Content } = req.body as {
      fileName?: string;
      contentType?: string;
      base64Content?: string;
    };

    if (!fileName || !contentType || !base64Content) {
      return res.status(400).json({
        success: false,
        message: "fileName, contentType, dan base64Content wajib diisi"
      });
    }

    const fileBuffer = Buffer.from(base64Content, "base64");
    const blob = await uploadDocument(fileName, fileBuffer, contentType);

    return res.status(201).json({
      success: true,
      data: {
        url: blob.url,
        pathname: blob.pathname,
        contentType
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Upload dokumen gagal"
    });
  }
});
