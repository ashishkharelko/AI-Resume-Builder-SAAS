
import * as pdfjsLibModule from 'pdfjs-dist';
import mammoth from 'mammoth';

// Fix for pdfjs-dist import structure in some ESM environments (like esm.sh)
// The library might be exported as a default object or named exports depending on the bundler/environment.
const pdfjsLib = (pdfjsLibModule as any).default || pdfjsLibModule;

// Configure worker for PDF.js
// We use CDNJS for the worker script because it reliably serves the file with correct CORS headers
// and doesn't have the redirection/module loading complexity of some ESM CDNs for Worker contexts.
if (pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

export const extractTextFromFile = async (file: File): Promise<string> => {
  const fileType = file.type;

  if (fileType === 'application/pdf') {
    return await extractTextFromPDF(file);
  } else if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
    fileType === 'application/msword'
  ) {
    return await extractTextFromDOCX(file);
  } else {
    throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
  }
};

const extractTextFromPDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  // Use the resolved pdfjsLib instance
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
};

const extractTextFromDOCX = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  // Mammoth is typically a CJS module, esm.sh provides a default export
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};
