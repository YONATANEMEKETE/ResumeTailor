'use client';

import React, { useState, useEffect, useId } from 'react';
import MarkdownRenderer from '@/components/common/MarkdownRenderer';
import { cn } from '@/lib/utils';
import Editer from './Editer';
import { Button } from '../ui/button';
import { Download, Eye, Pencil } from 'lucide-react';
import { motion } from 'motion/react';
import { Separator } from '../ui/separator';

interface Props {
  content: string;
}

const ResumeDisplay = ({ content }: Props) => {
  const [edittedcontent, setEdittedContent] = useState<string>(content);
  const [activeMode, setActiveMode] = useState<'preview' | 'edit'>('preview');
  const uniqueId = useId();

  // Update content when streaming
  useEffect(() => {
    setEdittedContent(content);
  }, [content]);

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting resume...');
  };

  return (
    <div className="mt-10">
      {/* Header Badge */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-primary/10">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-semibold text-primary">
            Generated Resume
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Animated Tabs */}
          <div className="flex items-center gap-1 p-1 border border-border rounded-lg bg-background/50">
            <button
              onClick={() => setActiveMode('preview')}
              className={cn(
                'relative flex items-center gap-2 px-4 py-1 text-sm font-medium rounded-md transition-colors z-10 cursor-pointer',
                activeMode === 'preview'
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Eye className="size-4" />
              Preview
              {activeMode === 'preview' && (
                <motion.div
                  layoutId={`activeTab-${uniqueId}`}
                  className="absolute inset-0 rounded-md bg-primary -z-10"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>

            <button
              onClick={() => setActiveMode('edit')}
              className={cn(
                'relative flex items-center gap-2 px-4 py-1 text-sm font-medium rounded-md transition-colors z-10 cursor-pointer',
                activeMode === 'edit'
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Pencil className="size-4" />
              Edit
              {activeMode === 'edit' && (
                <motion.div
                  layoutId={`activeTab-${uniqueId}`}
                  className="absolute inset-0 rounded-md bg-primary -z-10"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          </div>

          {/* Export Button */}
          <Button
            variant="outline"
            onClick={handleExport}
            className="gap-2 border-border hover:bg-secondary/50 cursor-pointer"
          >
            <Download className="size-4" />
            Export
          </Button>
        </div>
      </div>
      <div
        className={cn(
          'w-full rounded-lg border border-border bg-background',
          'shadow-sm hover:border-primary/40 transition-colors',
          activeMode === 'preview' && 'p-6',
          activeMode === 'edit' && 'p-0 overflow-hidden border-none'
        )}
      >
        {/* Resume Content */}
        {activeMode === 'preview' ? (
          <div className="resume-content">
            <MarkdownRenderer markdown={edittedcontent} />
          </div>
        ) : (
          <Editer content={edittedcontent} onChange={setEdittedContent} />
        )}
      </div>
    </div>
  );
};

export default ResumeDisplay;
