import React from 'react';
import MarkdownRenderer from '@/components/common/MarkdownRenderer';
import { cn } from '@/lib/utils';

interface Props {
  content: string;
}

const ResumeDisplay = ({ content }: Props) => {
  return (
    <div
      className={cn(
        'w-full rounded-lg border-2 border-primary/20 bg-primary/5',
        'p-6 my-6',
        'shadow-sm',
        'transition-all duration-200',
        'hover:border-primary/30 hover:shadow-md'
      )}
    >
      {/* Header Badge */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-primary/10">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-semibold text-primary">
            Generated Resume
          </span>
        </div>
      </div>

      {/* Resume Content */}
      <div className="resume-content">
        <MarkdownRenderer markdown={content} />
      </div>
    </div>
  );
};

export default ResumeDisplay;
