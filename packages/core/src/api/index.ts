export { CodeforcesAPIClient, createAPIClient } from './client';
export { generateAPISignature, validateCredentialsFormat } from './auth';
export type { APIResponse } from './client';
export type { APISignature } from './auth';

// Alpha 0.1: Analysis and filtering utilities
export {
  filterProblems,
  analyzeUserStatistics,
  recommendProblems,
  analyzeTagStrength,
  getProblemDifficultyDistribution
} from './utils';
