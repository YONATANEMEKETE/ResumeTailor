import React from 'react';
import MarkdownRenderer from '@/components/common/MarkdownRenderer';
import ResumeDisplay from '@/components/chat/ResumeDisplay';
import { parseResumeFromMarkdown } from '@/lib/markdown-parser';

interface Props {
  markdown: string;
}

/**
 * Smart wrapper component that detects and separates resume content from regular markdown
 *
 * This component:
 * 1. Parses the incoming markdown to detect |resume| markers
 * 2. Splits content into: before, resume, and after sections
 * 3. Renders resume content in a special ResumeDisplay component
 * 4. Renders other content in the normal MarkdownRenderer
 */
const MarkdownRendererWrapper = ({ markdown }: Props) => {
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
      {resumeContent.trim() && <ResumeDisplay content={resumeContent} />}

      {/* Render content after the resume */}
      {afterResume.trim() && <MarkdownRenderer markdown={afterResume} />}
    </div>
  );
};

export default MarkdownRendererWrapper;
