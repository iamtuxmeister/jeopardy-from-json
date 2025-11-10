# Jeopardy Server (Node + Express)

This repository is a GitHub-ready scaffold for a Jeopardy PowerPoint generator.

Features:
- POST JSON to `/generate` to get a PPTX (server-side template edited).
- Upload a CSV or Excel (`.xlsx`) via the `/upload` page (or POST to `/process`) to convert data into the same JSON and generate a PPTX.
- Uses `pptx-automizer` in the scaffold to load and replace placeholders in a server-side `.pptx` template.

## Quickstart

1. Clone the repo.
2. Install dependencies:

```bash
npm install
```

3. Add your PowerPoint template at `src/ppt/jeopardy_template.pptx`.
   - Template should contain placeholders like: `CATEGORY_1` ... `CATEGORY_6`
   - Question placeholders: `Q1_100`, `Q1_200`, ... `Q6_500`
4. Start the server:

```bash
npm start
```

5. Visit `http://localhost:3000/upload` to upload a CSV/XLSX and download the generated PPTX.

## Endpoints

- `POST /generate` — Accepts JSON:
```json
{
  "categories": ["People","Places"],
  "questions":[{"category":"People","value":100,"question":"...","answer":"..."}]
}
```

- `GET /upload` — Upload page for CSV/XLSX.
- `POST /process` — Accepts multipart form-data with field `datafile` (CSV/XLSX).

## Notes

- `pptx-automizer` is used in this scaffold for editing an existing PPTX template. If you'd prefer another library, replace `src/utils/pptEditor.js` accordingly.
- The sample CSV is in `data/sample.csv`.
- For GitHub: initialize a repo, commit, and push. See previous examples.

