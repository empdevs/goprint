import { put } from "@vercel/blob";
import { env } from "../../config/env.js";

export async function uploadDocument(fileName: string, content: Buffer, contentType: string) {
  const blob = await put(fileName, content, {
    access: "public",
    contentType,
    token: env.BLOB_READ_WRITE_TOKEN
  });

  return blob;
}
