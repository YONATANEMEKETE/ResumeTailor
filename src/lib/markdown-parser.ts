export interface ParsedMarkdown {
  beforeResume: string;
  resumeContent: string;
  afterResume: string;
  hasResume: boolean;
}

export function parseResumeFromMarkdown(markdown: string): ParsedMarkdown {
  // Initialize the result object with default values
  const result: ParsedMarkdown = {
    beforeResume: '',
    resumeContent: '',
    afterResume: '',
    hasResume: false,
  };

  // Split the text by the |resume| marker
  const parts = markdown.split('|resume|');

  // Check how many parts we have to determine the structure
  if (parts.length === 1) {
    // No |resume| markers found - all content goes to beforeResume
    result.beforeResume = parts[0];
    result.hasResume = false;
  } else if (parts.length === 2) {
    // Only one |resume| marker found - incomplete resume section
    // This happens during streaming when the second marker hasn't arrived yet
    result.beforeResume = parts[0];
    result.resumeContent = parts[1]; // Content after first marker (still streaming)
    result.hasResume = true; // Mark as having resume (even if incomplete)
  } else if (parts.length >= 3) {
    // Both |resume| markers found - complete resume section
    result.beforeResume = parts[0];
    result.resumeContent = parts[1]; // Content between the two markers
    result.afterResume = parts.slice(2).join('|resume|'); // Everything after (handles edge case of multiple markers)
    result.hasResume = true;
  }

  return result;
}
