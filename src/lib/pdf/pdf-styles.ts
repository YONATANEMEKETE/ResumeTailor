import { StyleSheet } from '@react-pdf/renderer';

export const pdfStyles = StyleSheet.create({
  // Page layout
  page: {
    padding: 20,
    fontSize: 9,
    fontFamily: 'Helvetica',
    lineHeight: 1.6,
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
  },

  // Heading styles (h1-h6)
  h1: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
    marginTop: 14,
    color: '#1a1a1a',
  },

  h2: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
    marginTop: 12,
    color: '#1a1a1a',
  },

  h3: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 7,
    marginTop: 10,
    color: '#1a1a1a',
  },

  h4: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
    marginTop: 8,
    color: '#1a1a1a',
  },

  h5: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
    marginTop: 7,
    color: '#1a1a1a',
  },

  h6: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
    marginTop: 6,
    color: '#1a1a1a',
  },

  // Paragraph and text styles
  paragraph: {
    fontSize: 9,
    lineHeight: 1.6,
    marginBottom: 6,
    color: '#374151',
    textAlign: 'justify',
  },

  // Text formatting
  bold: {
    fontFamily: 'Helvetica-Bold',
  },

  italic: {
    fontFamily: 'Helvetica-Oblique',
  },

  boldItalic: {
    fontFamily: 'Helvetica-BoldOblique',
  },

  // Links
  link: {
    color: '#2563eb',
    textDecoration: 'underline',
  },

  // Lists
  bulletList: {
    marginLeft: 12,
    marginBottom: 6,
  },

  bulletItem: {
    fontSize: 9,
    lineHeight: 1.6,
    marginBottom: 3,
    color: '#374151',
    flexDirection: 'row',
  },

  bullet: {
    width: 12,
    fontSize: 9,
    color: '#2563eb',
  },

  bulletText: {
    flex: 1,
  },

  // Sections and dividers
  section: {
    marginBottom: 12,
  },

  divider: {
    borderBottom: '0.75 solid #e5e7eb',
    marginVertical: 8,
  },

  // Code blocks
  code: {
    fontSize: 8,
    fontFamily: 'Courier',
    backgroundColor: '#f3f4f6',
    padding: 2,
    color: '#1f2937',
  },

  codeBlock: {
    fontSize: 8,
    fontFamily: 'Courier',
    backgroundColor: '#f3f4f6',
    padding: 8,
    marginVertical: 6,
    borderRadius: 3,
    color: '#1f2937',
  },
});
