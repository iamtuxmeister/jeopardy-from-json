import express from "express";
import { generateJeopardyPPTX } from "../utils/pptEditor.js";

const router = express.Router();

/**
 * POST /generate
 * Accepts JSON:
 * {
 *   categories: ["People","Places",...],
 *   questions: [{category:"People", value:100, question:"...", answer:"..."}, ...]
 * }
 */
router.post("/", async (req, res) => {
  try {
    const json = req.body;
    const buffer = await generateJeopardyPPTX(json);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
    res.setHeader("Content-Disposition", "attachment; filename=jeopardy_game.pptx");
    res.send(buffer);
  } catch (err) {
    console.error("Error generating PPTX:", err);
    res.status(500).json({ error: "Failed to generate presentation" });
  }
});

export default router;
