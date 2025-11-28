'use client';
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Plus, ArrowDown, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FileInputProps {
  onAttachment: (url: string) => void;
}

// let the user upload file upload it and show preview and send the url back to the parent.
const FileInput = ({ onAttachment }: FileInputProps) => {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      if (fileRejections.length > 0) {
        fileRejections.forEach((rejection) => {
          rejection.errors.forEach((error: any) => {
            if (error.code === 'file-invalid-type') {
              toast.error('Invalid file type. Please upload a PDF.', {
                style: {
                  '--normal-bg':
                    'color-mix(in oklab, var(--destructive) 10%, var(--background))',
                  '--normal-text': 'var(--destructive)',
                  '--normal-border': 'var(--destructive)',
                } as React.CSSProperties,
              });
            } else if (error.code === 'too-many-files') {
              toast.error('You can only upload one file.', {
                style: {
                  '--normal-bg':
                    'color-mix(in oklab, var(--destructive) 10%, var(--background))',
                  '--normal-text': 'var(--destructive)',
                  '--normal-border': 'var(--destructive)',
                } as React.CSSProperties,
              });
            } else {
              toast.error(error.message, {
                style: {
                  '--normal-bg':
                    'color-mix(in oklab, var(--destructive) 10%, var(--background))',
                  '--normal-text': 'var(--destructive)',
                  '--normal-border': 'var(--destructive)',
                } as React.CSSProperties,
              });
            }
          });
        });
      } else {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        // Create a temporary URL for the file
        const objectUrl = URL.createObjectURL(selectedFile);
        onAttachment(objectUrl);
      }
    },
    [onAttachment]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
    },
    noClick: false, // Allow clicking to open file dialog
  });

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening dropzone when clearing
    setFile(null);
    onAttachment('');
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex items-center justify-center h-full w-full cursor-pointer outline-none transition-colors',
        isDragActive && 'bg-accent/10'
      )}
    >
      <input {...getInputProps()} />

      <div
        className={cn(
          'flex flex-col items-center justify-center transition-all duration-200',
          !file && 'w-12 h-12 rounded-xl hover:bg-accent/10', // Button-like appearance when empty
          file && 'w-full h-full p-2', // Full space when file selected
          isDragActive ? 'text-primary' : 'text-muted-foreground'
        )}
      >
        {isDragActive ? (
          <ArrowDown className="w-6 h-6 animate-bounce" />
        ) : file ? (
          <div className="flex flex-col items-center justify-center w-full relative group animate-in fade-in zoom-in duration-200">
            <FileText className="w-5 h-5 mb-1 text-primary" />
            <span className="text-[10px] leading-tight truncate w-full text-center max-w-full px-1 font-medium">
              {file.name}
            </span>
            <button
              onClick={handleClear}
              className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-destructive/90"
              aria-label="Remove file"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <Plus className="w-5 h-5" />
        )}
      </div>
    </div>
  );
};

export default FileInput;
