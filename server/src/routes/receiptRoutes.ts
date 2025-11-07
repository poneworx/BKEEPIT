import express from "express";
import multer from "multer";
import path from "path";
import {
  uploadReceipt,
  getReceipts,
  getReceiptById,
} from "../controllers/receiptController";

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/receipts"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload a receipt image
router.post("/upload", upload.single("file"), uploadReceipt);

// Get all receipts
router.get("/", getReceipts);

// Get a single receipt by ID
router.get("/:id", getReceiptById);

export default router;
