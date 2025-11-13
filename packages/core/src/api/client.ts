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
import type { Contest, Problem, ContestStandings, APICredentials } from '../types';

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
}

/**
 * Create a new API client instance
 */
export function createAPIClient(): CodeforcesAPIClient {
  return new CodeforcesAPIClient();
}
