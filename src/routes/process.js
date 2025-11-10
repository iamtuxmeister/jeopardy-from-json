import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { parseFileToJSON } from "../utils/fileParser.js";
import { generateJeopardyPPTX } from "../utils/pptEditor.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

/**
 * POST /process
 * Accepts multipart/form-data with field 'datafile' (CSV or XLSX)
 * Parses file into JSON, then generates PPTX and returns it.
 */
router.post("/", upload.single("datafile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }
    const filePath = req.file.path;
    const mimetype = req.file.mimetype;
    const rows = await parseFileToJSON(filePath, mimetype);

    // normalize rows: expect columns category, value, question, answer
    const categories = [...new Set(rows.map(r => r.category || 'General'))];
    const questions = rows.map(r => ({
      category: r.category || 'General',
      value: parseInt(r.value, 10) || 100,
      question: r.question || '',
      answer: r.answer || ''
    }));

    const pptxBuffer = await generateJeopardyPPTX({ categories, questions });

    // cleanup uploaded file
    try { fs.unlinkSync(filePath); } catch(e){}

    res.setHeader("Content-Disposition", "attachment; filename=jeopardy_from_file.pptx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
    res.send(pptxBuffer);
  } catch (err) {
    console.error("Error processing file:", err);
    res.status(500).send("Failed to generate PowerPoint from file");
  }
});

export default router;
