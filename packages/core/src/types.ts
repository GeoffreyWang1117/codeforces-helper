/**
 * Core types for Codeforces Downloader
 * All user data stays LOCAL - no data collection
 */

export interface Contest {
  id: number;
  name: string;
  type: string;
  phase: string;
  durationSeconds: number;
  startTimeSeconds?: number;
}

export interface Problem {
  contestId: number;
  index: string;
  name: string;
  type: string;
  rating?: number;
  tags: string[];
}

export interface ProblemDetails extends Problem {
  statement: string;
  inputFormat: string;
  outputFormat: string;
  examples: Example[];
  notes?: string;
  timeLimit: string;
  memoryLimit: string;
}

export interface Example {
  input: string;
  output: string;
}

export interface ContestStandings {
  contest: Contest;
  problems: Problem[];
}

export interface APICredentials {
  apiKey: string;
  apiSecret: string;
}

/**
 * Secure storage interface - all implementations must:
 * 1. Store data LOCALLY on user's machine
 * 2. Use platform-provided encryption
 * 3. NEVER send data to external servers
 */
export interface ISecureStorage {
  /**
   * Store API credentials securely
   * - VS Code: Uses SecretStorage API (encrypted by OS)
   * - Browser: Uses chrome.storage.local (encrypted)
   * - Obsidian: Uses plugin data storage (user's vault)
   */
  storeCredentials(credentials: APICredentials): Promise<void>;

  /**
   * Retrieve API credentials from local storage
   */
  getCredentials(): Promise<APICredentials | null>;

  /**
   * Remove credentials from local storage
   */
  deleteCredentials(): Promise<void>;

  /**
   * Check if credentials are stored
   */
  hasCredentials(): Promise<boolean>;
}

export interface IStorage {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

export interface DownloadOptions {
  contestId: number;
  savePath: string;
  includeExamples?: boolean;
  includeTags?: boolean;
  template?: string;
}

export interface ScraperResult {
  success: boolean;
  problem?: ProblemDetails;
  error?: string;
}
