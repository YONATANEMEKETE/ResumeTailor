import React from 'react';
import MarkdownRenderer from '@/components/common/MarkdownRenderer';
import ResumeDisplay from '@/components/chat/ResumeDisplay';
import { parseResumeFromMarkdown } from '@/lib/markdown-parser';

interface Props {
  markdown: string;
  isStreaming: boolean;
}

const MarkdownRendererWrapper = ({ markdown, isStreaming }: Props) => {
  // Parse the markdown to extract resume content
  const { beforeResume, resumeContent, afterResume, hasResume } =
    parseResumeFromMarkdown(markdown);

  // If no resume markers found, render normally
  if (!hasResume) {
    return <MarkdownRenderer markdown={markdown} />;
  }

  // Resume markers found - render in sections
  return (
    <div className="w-full space-y-4">
      {/* Render content before the resume */}
      {beforeResume.trim() && <MarkdownRenderer markdown={beforeResume} />}

      {/* Render the resume content in a special component */}
      {resumeContent.trim() && (
        <ResumeDisplay content={resumeContent} isStreaming={isStreaming} />
      )}

      {/* Render content after the resume */}
      {afterResume.trim() && <MarkdownRenderer markdown={afterResume} />}
    </div>
  );
};

export default MarkdownRendererWrapper;
