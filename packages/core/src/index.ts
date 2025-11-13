/**
 * @cf-dl/core - Core functionality for Codeforces Downloader
 *
 * PRIVACY AND SECURITY GUARANTEE:
 * ================================
 * 1. ALL user data stays LOCAL on their machine
 * 2. API credentials are NEVER sent to any server except codeforces.com
 * 3. No analytics, no tracking, no data collection
 * 4. Open source - users can verify the code
 * 5. Uses platform-provided secure storage APIs
 *
 * This package provides:
 * - Codeforces API client
 * - Problem scraper
 * - Markdown converter
 * - Type definitions
 *
 * @packageDocumentation
 */

// Types
export type {
  Contest,
  Problem,
  ProblemDetails,
  Example,
  ContestStandings,
  APICredentials,
  ISecureStorage,
  IStorage,
  DownloadOptions,
  ScraperResult,
} from './types';

// API
export {
  CodeforcesAPIClient,
  createAPIClient,
  generateAPISignature,
  validateCredentialsFormat,
} from './api';
export type { APIResponse, APISignature } from './api';

// Scraper
export { ProblemScraper, fetchProblemHTML } from './scraper';
export type { HTMLParserAdapter } from './scraper';

// Converter
export { MarkdownConverter, createMarkdownConverter } from './converter';
export type { MarkdownTemplate } from './converter';
