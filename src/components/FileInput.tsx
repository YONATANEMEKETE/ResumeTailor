'use client';
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileInputProps {
  onAttachment: (url: string) => void;
}

// let the user upload file upload it and show preview and send the url back to the parent.
const FileInput = ({ onAttachment }: FileInputProps) => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onAttachment('')}
        className="w-12 h-12 rounded-xl text-muted-foreground hover:bg-transparent"
        aria-label="Attach file"
      >
        <Plus className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default FileInput;
