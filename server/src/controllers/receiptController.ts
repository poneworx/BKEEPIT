import type { Request, Response } from "express";
import * as ocr from "../services/ocrService";

export async function uploadReceipt(req: Request, res: Response) {
  try {
    // In a real setup, file comes from multer. Here we accept base64 or url in body for Phase 3.
    const image = (req.body && (req.body.base64 || req.body.url)) as string | undefined;
    if (!image) return res.status(400).json({ error: "Missing image data" });
    const parsed = await ocr.parseImage(image);
    return res.status(200).json({ parsed });
  } catch (err) {
    return res.status(500).json({ error: "Failed to parse receipt" });
  }
}