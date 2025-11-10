import express from "express";
import path from "path";
import generateRouter from "./src/routes/generate.js";
import uploadRouter from "./src/routes/upload.js";
import processRouter from "./src/routes/process.js";

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use("/generate", generateRouter);
app.use("/upload", uploadRouter);
app.use("/process", processRouter);

// Serve static views (upload page)
app.use('/views', express.static(path.join(path.resolve(), 'views')));

app.get("/", (req, res) => res.redirect("/upload"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Jeopardy server running at http://localhost:${PORT}`));
