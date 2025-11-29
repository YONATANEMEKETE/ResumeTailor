'use client';
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Plus, ArrowDown, FileText, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useUploadThing } from '@/lib/uploadResume';
import { ProgressRadial } from '../common/progress-1';
import { CircleProgress } from '../ui/circle-progress';
import PdfThumbnail from '../common/Pdfthumbnail';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface FileInputProps {
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
}

// let the user upload file upload it and show preview and send the url back to the parent.
const FileInput = ({ previewUrl, setPreviewUrl }: FileInputProps) => {
  const [progress, setProgress] = useState<number>(0);

  const { startUpload, isUploading } = useUploadThing('resumeUploader', {
    onClientUploadComplete: (res) => {
      setPreviewUrl(res[0].url);
      setProgress(0);
    },
    onUploadProgress: (progress) => {
      setProgress(progress);
    },
  });

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
        startUpload([selectedFile]);
      }
    },
    [setPreviewUrl]
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
    setPreviewUrl(null);
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
          'w-full h-full p-2', // Full space when file selected
          isDragActive ? 'text-primary' : 'text-muted-foreground'
        )}
      >
        {isUploading ? (
          <div className="flex items-center justify-center w-full h-full relative">
            <CircleProgress
              value={progress}
              maxValue={100}
              size={50}
              strokeWidth={5}
              getColor={() => {
                return 'stroke-primary/60';
              }}
            />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-forground font-medium text-sm">
              {progress}%
            </span>
          </div>
        ) : previewUrl ? (
          <div className="w-full h-full relative">
            <PdfThumbnail url={previewUrl} />
          </div>
        ) : isDragActive ? (
          <ArrowDown className="w-6 h-6 animate-bounce" />
        ) : (
          <Tooltip>
            <TooltipTrigger asChild className="cursor-pointer">
              <Plus className="w-5 h-5" />
            </TooltipTrigger>
            <TooltipContent className="bg-background text-foreground border border-border">
              <p>Dran and Drop or click to upload</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default FileInput;
