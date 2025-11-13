/**
 * API Authentication Module
 *
 * SECURITY GUARANTEE:
 * - All credentials are processed LOCALLY
 * - No data is sent to any third-party servers
 * - Signature generation follows Codeforces official protocol
 */

import { createHash } from 'crypto';

export interface APISignature {
  apiSig: string;
  time: string;
}

/**
 * Generate random string for API signature
 */
function generateRandomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate API signature for authenticated requests
 *
 * @param method - API method name (e.g., 'contest.standings')
 * @param apiKey - User's API key (stored locally)
 * @param apiSecret - User's API secret (stored locally, NEVER logged)
 * @param params - Request parameters
 * @returns Signature object with apiSig and timestamp
 *
 * NOTE: This follows Codeforces official API documentation:
 * https://codeforces.com/apiHelp
 */
export function generateAPISignature(
  method: string,
  apiKey: string,
  apiSecret: string,
  params: Record<string, any>
): APISignature {
  // Generate random 6-character string
  const rand = generateRandomString(6);

  // Current timestamp
  const time = Math.floor(Date.now() / 1000).toString();

  // Sort parameters alphabetically
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');

  // Construct string to sign: rand/method?params#secret
  const toSign = `${rand}/${method}?${sortedParams}#${apiSecret}`;

  // Generate SHA-512 hash
  const hash = createHash('sha512').update(toSign).digest('hex');

  // Combine rand + hash
  const apiSig = rand + hash;

  return { apiSig, time };
}

/**
 * Validate API credentials format (basic check)
 * Does NOT verify if credentials are correct - that's done by API
 */
export function validateCredentialsFormat(apiKey: string, apiSecret: string): boolean {
  // Codeforces API keys and secrets are typically 40-character hex strings
  const hexPattern = /^[a-f0-9]{40}$/i;
  return hexPattern.test(apiKey) && hexPattern.test(apiSecret);
}
