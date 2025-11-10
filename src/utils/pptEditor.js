import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

/**
 * Generate Jeopardy PPTX from template
 * Replaces placeholders in slide text AND notes section
 * @param {Object} data
 * @param {Array<string>} data.categories
 * @param {Array<Object>} data.questions - {category, value, question, answer}
 * @returns {Buffer} - PPTX file buffer
 */
export async function generateJeopardyPPTX({ categories, questions }) {
  const templatePath = path.resolve("src/ppt/jeopardy_template.pptx");
  const content = fs.readFileSync(templatePath);

  // Load PPTX as zip
  const zip = new PizZip(content);

  // Docxtemplater handles main slides
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

  // Prepare replacement data
  const data = {};

  // Add categories
  categories.forEach((cat, i) => {
    data[`CATEGORY_${i + 1}`] = cat;
  });

  // Add questions and answers
  questions.forEach(q => {
    const catIndex = categories.indexOf(q.category) + 1;
    data[`Q${catIndex}_${q.value}`] = q.question;
    data[`A${catIndex}_${q.value}`] = q.answer;
  });

  // Replace placeholders in slide text
  doc.render(data);

  // Replace placeholders in notes slides
  const notesKeys = Object.keys(data);
  const notesSlideFiles = Object.keys(zip.files).filter(f => f.startsWith("ppt/notesSlides/notesSlide"));

  notesSlideFiles.forEach(fileName => {
    const xml = zip.files[fileName].asText();
    let newXml = xml;

    notesKeys.forEach(key => {
      // Replace all occurrences of {KEY} in notes XML
      const regex = new RegExp(`\\{${key}\\}`, "g");
      newXml = newXml.replace(regex, data[key]);
    });

    zip.file(fileName, newXml);
  });

  // Generate final PPTX buffer
  return doc.getZip().generate({ type: "nodebuffer" });
}

