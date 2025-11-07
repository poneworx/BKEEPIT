// service: ocrService.ts
import Tesseract from "tesseract.js";

// Define an OCR provider interface
export interface OCRProvider {
  extractText: (imagePath: string) => Promise<string>;
}

// Local OCR provider using tesseract.js
export const LocalOCR: OCRProvider = {
  async extractText(imagePath) {
    try {
      const result = await Tesseract.recognize(imagePath, "eng");
      return result.data.text;
    } catch (err) {
      console.error("Tesseract OCR failed:", err);
      throw new Error("Failed to extract text from image.");
    }
  },
};

// Cloud OCR placeholder for future use
export const CloudOCR: OCRProvider = {
  async extractText(imagePath) {
    // TODO: Add integration with Google Vision, AWS Textract, or Azure Cognitive Services
    console.warn("Cloud OCR not implemented yet — using placeholder.");
    return "Cloud OCR not implemented yet";
  },
};

// Environment-driven provider selector
export const OCRService: OCRProvider =
  process.env.USE_CLOUD_OCR === "true" ? CloudOCR : LocalOCR;
