import fs from "fs";
import { parse } from "csv-parse";
import xlsx from "xlsx";

/**
 * parseFileToJSON(filePath, mimetype)
 * Returns Promise resolving to array of objects with keys: category, value, question, answer
 */
export function parseFileToJSON(filePath, mimetype) {
  if (filePath.toLowerCase().endsWith('.xlsx') || mimetype.includes('sheet') || mimetype.includes('excel')) {
    return parseExcel(filePath);
  } else {
    return parseCSV(filePath);
  }
}

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, trim: true }))
      .on("data", (row) => results.push(normalizeRow(row)))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

function parseExcel(filePath) {
  return new Promise((resolve, reject) => {
    try {
      const workbook = xlsx.readFile(filePath);
      const firstSheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[firstSheetName];
      const data = xlsx.utils.sheet_to_json(sheet, { defval: "" });
      resolve(data.map(normalizeRow));
    } catch (err) {
      reject(err);
    }
  });
}

function normalizeRow(row) {
  // normalize keys to lower-case
  const lowered = {};
  for (const k of Object.keys(row)) {
    lowered[k.toLowerCase().trim()] = row[k];
  }
  return {
    category: lowered['category'] || lowered['cat'] || 'General',
    value: Number(lowered['value'] || lowered['points'] || 100),
    question: lowered['question'] || lowered['q'] || '',
    answer: lowered['answer'] || lowered['ans'] || ''
  };
}
