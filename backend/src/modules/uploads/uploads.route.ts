import { Router } from "express";
import { uploadDocument } from "../../services/blob/blob.service.js";
import { get } from "@vercel/blob";
import { Readable } from "stream";

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

uploadsRouter.get("/download", async (req, res) => {
  try {
    const fileUrl = req.query.url as string;
    
    if (!fileUrl) {
      return res.status(400).json({ message: "Parameter URL wajib diisi" });
    }

    // Ambil file private menggunakan Vercel SDK [1][2]
    const { stream, blob }:any = await get(fileUrl, { access: "private" });

    // Set Header yang benar agar browser bisa membaca jenis filenya (PDF, Word, dll)
    res.setHeader("Content-Type", blob.contentType);
    
    // Ubah format Web Stream dari Vercel API ke Node.js Stream
    // Catatan: Membutuhkan minimal Node.js versi 18
    Readable.fromWeb(stream as any).pipe(res);

  } catch (error) {
    console.error("Gagal menarik file dari Vercel Blob:", error);
    res.status(500).json({ message: "Gagal membuka file" });
  }
});