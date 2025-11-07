import { Request, Response } from "express";
import { OCRService } from "../services/ocrService";
import { Receipt } from "../models/Receipt";

// Upload and process a receipt image
export async function uploadReceipt(req: Request, res: Response) {
  try {
    // 1. Ensure file exists
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const imagePath = req.file.path;

    // 2. Extract text using the selected OCR provider
    const extractedText = await OCRService.extractText(imagePath);

    // 3. Save receipt and extracted text to database
    const receipt = await Receipt.create({
      filename: req.file.filename,
      filepath: imagePath,
      text: extractedText,
      uploadedAt: new Date(),
    });

    // 4. Respond with the parsed result
    return res.status(200).json({
      success: true,
      message: "Receipt processed successfully.",
      data: receipt,
    });
  } catch (error) {
    console.error("Error in uploadReceipt:", error);
    return res
      .status(500)
      .json({ error: "Failed to process receipt. Please try again later." });
  }
}

// Get all stored receipts
export async function getReceipts(req: Request, res: Response) {
  try {
    const receipts = await Receipt.find().sort({ uploadedAt: -1 });
    return res.status(200).json({ success: true, data: receipts });
  } catch (error) {
    console.error("Error fetching receipts:", error);
    return res.status(500).json({ error: "Failed to fetch receipts." });
  }
}

// Get a specific receipt by ID
export async function getReceiptById(req: Request, res: Response) {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) return res.status(404).json({ error: "Receipt not found." });

    return res.status(200).json({ success: true, data: receipt });
  } catch (error) {
    console.error("Error fetching receipt:", error);
    return res.status(500).json({ error: "Failed to fetch receipt." });
  }
}
