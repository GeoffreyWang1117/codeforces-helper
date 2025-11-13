/**
 * Codeforces API Client
 *
 * PRIVACY GUARANTEE:
 * - All API calls go directly to codeforces.com
 * - No intermediary servers or proxies
 * - Credentials never leave user's device
 * - Open source - users can verify the code
 */

import { generateAPISignature } from './auth';
import type {
  Contest,
  Problem,
  ContestStandings,
  APICredentials,
  User,
  Submission,
  RatingChange,
  ProblemsetResponse,
  Hack
} from '../types';

const API_BASE = 'https://codeforces.com/api';

export interface APIResponse<T> {
  status: 'OK' | 'FAILED';
  result?: T;
  comment?: string;
}

export class CodeforcesAPIClient {
  private credentials: APICredentials | null = null;

  /**
   * Set API credentials for authenticated requests
   * Credentials are stored in memory ONLY during the session
   */
  setCredentials(credentials: APICredentials | null) {
    this.credentials = credentials;
  }

  /**
   * Fetch contest list (public API, no auth required)
   */
  async getContestList(gym: boolean = false): Promise<Contest[]> {
    const url = `${API_BASE}/contest.list?gym=${gym}`;
    const response = await fetch(url);
    const data: APIResponse<Contest[]> = await response.json();

    if (data.status === 'OK' && data.result) {
      return data.result;
    }

    throw new Error(data.comment || 'Failed to fetch contest list');
  }

  /**
   * Fetch contest standings (requires auth for full access)
   */
  async getContestStandings(
    contestId: number,
    from: number = 1,
    count: number = 1
  ): Promise<ContestStandings> {
    const method = 'contest.standings';

    const params: Record<string, any> = {
      contestId,
      from,
      count,
    };

    // Add authentication if credentials are available
    if (this.credentials) {
      params.apiKey = this.credentials.apiKey;
      params.time = Math.floor(Date.now() / 1000);

      const { apiSig, time } = generateAPISignature(
        method,
        this.credentials.apiKey,
        this.credentials.apiSecret,
        params
      );

      params.time = time;
      params.apiSig = apiSig;
    }

    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE}/${method}?${queryString}`;

    const response = await fetch(url);
    const data: APIResponse<any> = await response.json();

    if (data.status === 'OK' && data.result) {
      return {
        contest: data.result.contest,
        problems: data.result.problems,
      };
    }

    throw new Error(data.comment || 'Failed to fetch contest standings');
  }

  /**
   * Fetch problem by contest and index (public API)
   */
  async getProblems(contestId: number): Promise<Problem[]> {
    const standings = await this.getContestStandings(contestId);
    return standings.problems;
  }

  /**
   * Test API credentials validity
   * Returns true if credentials work, false otherwise
   */
  async testCredentials(credentials: APICredentials): Promise<boolean> {
    try {
      const prevCredentials = this.credentials;
      this.setCredentials(credentials);

      // Try to fetch a recent contest standings
      await this.getContestStandings(2000, 1, 1);

      // Restore previous credentials
      this.setCredentials(prevCredentials);

      return true;
    } catch (error) {
      return false;
    }
  }

  // ===== Alpha 0.1 新增方法 =====

  /**
   * Get user information (public API)
   * @param handles - Array of user handles (max 10000)
   */
  async getUserInfo(handles: string[]): Promise<User[]> {
    if (handles.length === 0) {
      throw new Error('At least one handle is required');
    }

    const url = `${API_BASE}/user.info?handles=${handles.join(';')}`;
    const response = await fetch(url);
    const data: APIResponse<User[]> = await response.json();

    if (data.status === 'OK' && data.result) {
      return data.result;
    }

    throw new Error(data.comment || 'Failed to fetch user info');
  }

  /**
   * Get user submission history (public API)
   * @param handle - User handle
   * @param from - Starting index (1-based)
   * @param count - Number of submissions to fetch
   */
  async getUserStatus(
    handle: string,
    from: number = 1,
    count: number = 100
  ): Promise<Submission[]> {
    const url = `${API_BASE}/user.status?handle=${handle}&from=${from}&count=${count}`;
    const response = await fetch(url);
    const data: APIResponse<Submission[]> = await response.json();

    if (data.status === 'OK' && data.result) {
      return data.result;
    }

    throw new Error(data.comment || 'Failed to fetch user status');
  }

  /**
   * Get user rating changes (public API)
   * @param handle - User handle
   */
  async getUserRating(handle: string): Promise<RatingChange[]> {
    const url = `${API_BASE}/user.rating?handle=${handle}`;
    const response = await fetch(url);
    const data: APIResponse<RatingChange[]> = await response.json();

    if (data.status === 'OK' && data.result) {
      return data.result;
    }

    throw new Error(data.comment || 'Failed to fetch user rating');
  }

  /**
   * Get problemset (public API)
   * @param tags - Optional array of tags to filter
   */
  async getProblemset(tags?: string[]): Promise<ProblemsetResponse> {
    let url = `${API_BASE}/problemset.problems`;
    if (tags && tags.length > 0) {
      url += `?tags=${tags.join(';')}`;
    }

    const response = await fetch(url);
    const data: APIResponse<ProblemsetResponse> = await response.json();

    if (data.status === 'OK' && data.result) {
      return data.result;
    }

    throw new Error(data.comment || 'Failed to fetch problemset');
  }

  /**
   * Get recent submissions from problemset (public API)
   * @param count - Number of submissions to fetch
   */
  async getRecentSubmissions(count: number = 100): Promise<Submission[]> {
    const url = `${API_BASE}/problemset.recentStatus?count=${count}`;
    const response = await fetch(url);
    const data: APIResponse<Submission[]> = await response.json();

    if (data.status === 'OK' && data.result) {
      return data.result;
    }

    throw new Error(data.comment || 'Failed to fetch recent submissions');
  }

  /**
   * Get contest hacks (public API)
   * @param contestId - Contest ID
   */
  async getContestHacks(contestId: number): Promise<Hack[]> {
    const url = `${API_BASE}/contest.hacks?contestId=${contestId}`;
    const response = await fetch(url);
    const data: APIResponse<Hack[]> = await response.json();

    if (data.status === 'OK' && data.result) {
      return data.result;
    }

    throw new Error(data.comment || 'Failed to fetch contest hacks');
  }

  /**
   * Get contest submissions (public API)
   * @param contestId - Contest ID
   * @param handle - Optional user handle filter
   * @param from - Starting index (1-based)
   * @param count - Number of submissions to fetch
   */
  async getContestStatus(
    contestId: number,
    handle?: string,
    from: number = 1,
    count: number = 100
  ): Promise<Submission[]> {
    let url = `${API_BASE}/contest.status?contestId=${contestId}&from=${from}&count=${count}`;
    if (handle) {
      url += `&handle=${handle}`;
    }

    const response = await fetch(url);
    const data: APIResponse<Submission[]> = await response.json();

    if (data.status === 'OK' && data.result) {
      return data.result;
    }

    throw new Error(data.comment || 'Failed to fetch contest status');
  }

  /**
   * Get upcoming contests (filter from contest list)
   */
  async getUpcomingContests(): Promise<Contest[]> {
    const contests = await this.getContestList(false);
    const now = Math.floor(Date.now() / 1000);

    return contests.filter((contest) => {
      return contest.phase === 'BEFORE' ||
             (contest.startTimeSeconds && contest.startTimeSeconds > now);
    });
  }
}

/**
 * Create a new API client instance
 */
export function createAPIClient(): CodeforcesAPIClient {
  return new CodeforcesAPIClient();
}
