import { analyzeSystemPrompt, generateSystemprompt } from '@/data/prompts';

export interface PromptParams {
  resumeContent?: string;
  jobDescription?: string;
  task: 'analyze' | 'generate' | 're-generate' | 'assist';
  analysis?: string;
}

export interface promptResponse {
  systemPrompt: string;
  userPrompt: string;
}

export const generateTheRightPrompts = ({
  resumeContent,
  jobDescription,
  analysis,
  task,
}: PromptParams) => {
  if (task === 'analyze') {
    return {
      systemPrompt: analyzeSystemPrompt,
      userPrompt: `
           Below is the user's resume and job description.

           ### Resume
           ${resumeContent}

           ### Job Description
           ${jobDescription}
        `,
    };
  } else if (task === 'generate') {
    return {
      systemPrompt: generateSystemprompt,
      userPrompt: `
           Below is the analysis, job_description and the original resume. Rewrite the resume using the system rules.

           ### Analysis
           ${analysis}

           ### Job Description
           ${jobDescription}

           ### Original Resume
           ${resumeContent}
        `,
    };
  }
  //  todo the re-generate and assist tasks remain left
  return {
    systemPrompt: '',
    userPrompt: '',
  };
};
