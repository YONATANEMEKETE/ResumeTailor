import pdfToText from 'react-pdftotext';

export const extractPdfContent = async (pdfUrl: string) => {
  try {
    const file = await fetch(pdfUrl).then((res) => res.blob());
    const extractedContent = await pdfToText(file);
    return extractedContent;
  } catch (error) {
    console.error('Error extracting PDF content:', error);
    return null;
  }
};
