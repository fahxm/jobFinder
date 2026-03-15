

import { analyzeSkills } from './ai/analysis';
import { getChatResponse } from './ai/chatbot';
import { generateCareerRoadmap } from './ai/roadmap';
import { generateATSResume, parseResumeForProfile } from './ai/resume';

export const AIService = {
    analyzeSkills,
    getChatResponse,
    generateCareerRoadmap,
    generateATSResume,
    parseResumeForProfile
};
