import { Router } from "express";
import { uploadReceipt } from "../controllers/receiptController";

const router = Router();
router.post("/upload", uploadReceipt);
export default router;