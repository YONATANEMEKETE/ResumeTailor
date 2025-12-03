import {
  analyzeSystemPrompt,
  assistSystemPrompt,
  generateSystemprompt,
  reGenerateSystemPrompt,
} from '@/data/prompts';

export interface PromptParams {
  task: 'analyze' | 'generate' | 're-generate' | 'assist';
}

export interface promptResponse {
  systemPrompt: string;
}

export const generateTheRightPrompts = ({ task }: PromptParams) => {
  if (task === 'analyze') {
    return {
      systemPrompt: analyzeSystemPrompt,
    };
  } else if (task === 'generate') {
    return {
      systemPrompt: generateSystemprompt,
    };
  } else if (task === 're-generate') {
    return {
      systemPrompt: reGenerateSystemPrompt,
    };
  } else if (task === 'assist') {
    return {
      systemPrompt: assistSystemPrompt,
    };
  }
  //  todo the re-generate and assist tasks remain left
  return {
    systemPrompt: '',
  };
};
