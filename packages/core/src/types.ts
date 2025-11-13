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

// ===== Alpha 0.1 新增类型 =====

/**
 * User information from Codeforces
 */
export interface User {
  handle: string;
  email?: string;
  vkId?: string;
  openId?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  city?: string;
  organization?: string;
  contribution: number;
  rank?: string;
  rating?: number;
  maxRank?: string;
  maxRating?: number;
  lastOnlineTimeSeconds: number;
  registrationTimeSeconds: number;
  friendOfCount: number;
  avatar: string;
  titlePhoto: string;
}

/**
 * Party (user or team) in a contest
 */
export interface Party {
  contestId?: number;
  members: Member[];
  participantType: string;
  teamId?: number;
  teamName?: string;
  ghost: boolean;
  room?: number;
  startTimeSeconds?: number;
}

export interface Member {
  handle: string;
  name?: string;
}

/**
 * Submission information
 */
export interface Submission {
  id: number;
  contestId?: number;
  creationTimeSeconds: number;
  relativeTimeSeconds: number;
  problem: Problem;
  author: Party;
  programmingLanguage: string;
  verdict?: string;
  testset: string;
  passedTestCount: number;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
}

/**
 * Rating change from a contest
 */
export interface RatingChange {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

/**
 * Problemset response with statistics
 */
export interface ProblemsetResponse {
  problems: Problem[];
  problemStatistics: ProblemStatistic[];
}

export interface ProblemStatistic {
  contestId?: number;
  index: string;
  solvedCount: number;
}

/**
 * Options for filtering problems
 */
export interface FilterOptions {
  minRating?: number;
  maxRating?: number;
  tags?: string[];
  excludeTags?: string[];
  minSolvedCount?: number;
  maxSolvedCount?: number;
}

/**
 * User statistics analysis
 */
export interface UserStatistics {
  handle: string;
  solvedCount: number;
  attemptedCount: number;
  acceptanceRate: number;
  byRating: Record<number, number>;
  byTags: Record<string, number>;
  favoriteLanguage: string;
  recentActivity: number; // submissions in last 30 days
}

/**
 * Hack information
 */
export interface Hack {
  id: number;
  creationTimeSeconds: number;
  hacker: Party;
  defender: Party;
  verdict?: string;
  problem: Problem;
  test?: string;
  judgeProtocol?: any;
}
