'use client';

import React, { useState, useEffect, useId } from 'react';
import MarkdownRenderer from '@/components/common/MarkdownRenderer';
import { cn } from '@/lib/utils';
import Editer from './editor/Editer';
import { Button } from '../ui/button';
import { Download, Eye, Pencil, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface Props {
  content: string;
  isStreaming: boolean;
}

const ResumeDisplay = ({ content, isStreaming }: Props) => {
  const [edittedcontent, setEdittedContent] = useState<string>(content);
  const [activeMode, setActiveMode] = useState<'preview' | 'edit'>('preview');
  const [isExporting, setIsExporting] = useState(false);
  const uniqueId = useId();

  // Update content when streaming
  useEffect(() => {
    setEdittedContent(content);
  }, [content]);

  const handleExport = async () => {
    // Validate content
    if (!edittedcontent || edittedcontent.trim().length === 0) {
      toast.error('Resume content is empty. Please generate a resume first.', {
        description: 'Export Failed',
      });
      return;
    }

    try {
      setIsExporting(true);

      // Call API to generate PDF
      const response = await fetch('/api/export-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: edittedcontent }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      // Get PDF blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Show success message
      toast.success('Your resume has been downloaded as PDF.', {
        description: 'Export Successful',
      });
    } catch (error) {
      console.error('Export error:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.',
        {
          description: 'Export Failed',
        }
      );
    } finally {
      setIsExporting(false);
    }
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
                'relative flex items-center gap-2 px-4 py-1 text-sm font-medium rounded-md transition-colors z-10 cursor-pointer disabled:cursor-not-allowed',
                activeMode === 'edit'
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              disabled={isStreaming}
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
            disabled={isExporting || isStreaming}
            className="gap-2 border-border hover:bg-secondary/50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="size-4" />
                Export
              </>
            )}
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
