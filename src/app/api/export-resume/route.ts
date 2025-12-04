import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { generatePDFDocument } from '@/lib/pdf/pdf-generator';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { content } = body;

    // Validate content
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Invalid content provided' },
        { status: 400 }
      );
    }

    // Generate PDF document
    const pdfDocument = generatePDFDocument({ content });

    // Render to buffer
    const pdfBuffer = await renderToBuffer(pdfDocument);

    // Convert Buffer to Uint8Array for NextResponse
    const pdfBytes = new Uint8Array(pdfBuffer);

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `resume-${timestamp}.pdf`;

    // Return PDF with proper headers
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
