import { Text, View, Link } from '@react-pdf/renderer';
import { pdfStyles } from './pdf-styles';
import { parse, HTMLElement, TextNode } from 'node-html-parser';

interface PDFNode {
  type: 'text' | 'element';
  tag?: string;
  content?: string;
  children?: PDFNode[];
  attributes?: Record<string, string>;
}

/**
 * Parse HTML string into a tree structure
 */
export function parseHTML(html: string): PDFNode[] {
  const root = parse(html);
  return parseNode(root);
}

/**
 * Recursively parse HTML nodes
 */
function parseNode(node: any): PDFNode[] {
  const nodes: PDFNode[] = [];

  if (!node.childNodes) return nodes;

  for (const child of node.childNodes) {
    if (child.nodeType === 3) {
      // Text node
      const text = child.text.trim();
      if (text) {
        nodes.push({
          type: 'text',
          content: text,
        });
      }
    } else if (child.nodeType === 1) {
      // Element node
      const element = child as HTMLElement;
      nodes.push({
        type: 'element',
        tag: element.tagName.toLowerCase(),
        attributes: element.attributes || {},
        children: parseNode(element),
      });
    }
  }

  return nodes;
}

/**
 * Convert parsed HTML nodes to React PDF components
 */
export function renderPDFNodes(nodes: PDFNode[], key: string = '0'): any[] {
  return nodes
    .map((node, index) => {
      const nodeKey = `${key}-${index}`;

      if (node.type === 'text') {
        return node.content;
      }

      if (node.type === 'element' && node.tag) {
        return renderElement(node, nodeKey);
      }

      return null;
    })
    .filter(Boolean);
}

/**
 * Render individual HTML elements as PDF components
 */
function renderElement(node: PDFNode, key: string): any {
  const children = node.children ? renderPDFNodes(node.children, key) : [];

  switch (node.tag) {
    // Headings
    case 'h1':
      return (
        <Text key={key} style={pdfStyles.h1}>
          {children}
        </Text>
      );
    case 'h2':
      return (
        <Text key={key} style={pdfStyles.h2}>
          {children}
        </Text>
      );
    case 'h3':
      return (
        <Text key={key} style={pdfStyles.h3}>
          {children}
        </Text>
      );
    case 'h4':
      return (
        <Text key={key} style={pdfStyles.h4}>
          {children}
        </Text>
      );
    case 'h5':
      return (
        <Text key={key} style={pdfStyles.h5}>
          {children}
        </Text>
      );
    case 'h6':
      return (
        <Text key={key} style={pdfStyles.h6}>
          {children}
        </Text>
      );

    // Paragraphs
    case 'p':
      return (
        <Text key={key} style={pdfStyles.paragraph}>
          {children}
        </Text>
      );

    // Text formatting
    case 'strong':
    case 'b':
      return (
        <Text key={key} style={pdfStyles.bold}>
          {' '}
          {children}{' '}
        </Text>
      );

    case 'em':
    case 'i':
      return (
        <Text key={key} style={pdfStyles.italic}>
          {' '}
          {children}{' '}
        </Text>
      );

    case 'u':
      return (
        <Text key={key} style={{ textDecoration: 'underline' }}>
          {' '}
          {children}{' '}
        </Text>
      );

    // Links
    case 'a':
      return (
        <Link
          key={key}
          src={node.attributes?.href || '#'}
          style={pdfStyles.link}
        >
          {' '}
          {children}{' '}
        </Link>
      );

    // Lists
    case 'ul':
      return (
        <View key={key} style={pdfStyles.bulletList}>
          {children}
        </View>
      );

    case 'ol':
      return (
        <View key={key} style={pdfStyles.bulletList}>
          {children}
        </View>
      );

    case 'li':
      return (
        <View key={key} style={pdfStyles.bulletItem}>
          <Text style={pdfStyles.bullet}>•</Text>
          <Text style={pdfStyles.bulletText}>{children}</Text>
        </View>
      );

    // Divs and sections
    case 'div':
    case 'section':
      return (
        <View key={key} style={pdfStyles.section}>
          {children}
        </View>
      );

    // Horizontal rule
    case 'hr':
      return <View key={key} style={pdfStyles.divider} />;

    // Line breaks
    case 'br':
      return <Text key={key}>{'\n'}</Text>;

    // Code
    case 'code':
      return (
        <Text key={key} style={pdfStyles.code}>
          {children}
        </Text>
      );

    case 'pre':
      return (
        <View key={key} style={pdfStyles.codeBlock}>
          <Text>{children}</Text>
        </View>
      );

    // Span (inline)
    case 'span':
      return <Text key={key}>{children}</Text>;

    // Default: render as view
    default:
      return <View key={key}>{children}</View>;
  }
}

/**
 * Clean HTML before parsing (remove scripts, styles, etc.)
 */
export function cleanHTML(html: string): string {
  // Remove script tags
  html = html.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ''
  );

  // Remove style tags
  html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Remove comments
  html = html.replace(/<!--[\s\S]*?-->/g, '');

  // Normalize whitespace
  html = html.replace(/\s+/g, ' ');

  return html.trim();
}
