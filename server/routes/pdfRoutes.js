import express from "express";
import { proxyPDF } from "../controllers/pdfController.js";

const router = express.Router();

// Route: GET /api/pdf/proxy?url=<PDF_URL>
router.get("/proxy", proxyPDF);

export default router;
