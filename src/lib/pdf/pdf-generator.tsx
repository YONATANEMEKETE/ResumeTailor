import { Document, Page, View } from '@react-pdf/renderer';
import { pdfStyles } from './pdf-styles';
import { parseHTML, renderPDFNodes, cleanHTML } from './html-to-pdf';

interface GeneratePDFOptions {
  content: string;
  fileName?: string;
}

/**
 * Generate a PDF document from HTML content
 */
export function generatePDFDocument(options: GeneratePDFOptions) {
  const { content } = options;

  // Clean and parse HTML
  const cleanedHTML = cleanHTML(content);
  const parsedNodes = parseHTML(cleanedHTML);

  // Convert to PDF components
  const pdfContent = renderPDFNodes(parsedNodes);

  // Create PDF document
  return (
    <Document
      title="Resume"
      author="Resume Tailor"
      subject="Professional Resume"
      creator="Resume Tailor App"
    >
      <Page size="A4" style={pdfStyles.page}>
        <View>{pdfContent}</View>
      </Page>
    </Document>
  );
}
