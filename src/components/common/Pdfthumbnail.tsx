'use client';

import { useEffect, useState } from 'react';

export default function PdfThumbnail({ url }: { url: string }) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    const renderThumbnail = async () => {
      // Dynamically import pdfjs-dist only on client side
      const pdfjsLib = await import('pdfjs-dist');

      // Configure worker with correct .mjs extension
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

      const pdf = await pdfjsLib.getDocument(url).promise;
      const page = await pdf.getPage(1); // first page

      const viewport = page.getViewport({ scale: 0.3 }); // small thumbnail
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvas, canvasContext: context, viewport }).promise;

      const img = canvas.toDataURL('image/png');
      setThumbnail(img);
    };

    renderThumbnail();
  }, [url]);

  if (!thumbnail)
    return <div className="w-full h-full bg-muted animate-pulse" />;

  return (
    <img
      src={thumbnail}
      alt="PDF preview"
      className="w-full h-full object-cover rounded-md shadow"
    />
  );
}
