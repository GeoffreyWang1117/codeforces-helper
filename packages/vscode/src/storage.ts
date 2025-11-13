/**
 * Secure Storage Implementation for VS Code
 *
 * SECURITY FEATURES:
 * =================
 * 1. Uses VS Code's SecretStorage API (encrypted by OS keychain)
 * 2. Credentials NEVER leave the user's machine
 * 3. No telemetry, no logging of sensitive data
 * 4. Clear separation between secure and regular storage
 *
 * SecretStorage is backed by:
 * - macOS: Keychain
 * - Windows: Credential Manager
 * - Linux: Secret Service API (libsecret)
 */

import * as vscode from 'vscode';
import type { APICredentials, ISecureStorage, IStorage } from '@cf-dl/core';

const API_KEY_STORAGE_KEY = 'codeforces.apiKey';
const API_SECRET_STORAGE_KEY = 'codeforces.apiSecret';

/**
 * Secure storage for API credentials
 * Uses VS Code's SecretStorage API which encrypts data using OS-level keychain
 */
export class VSCodeSecureStorage implements ISecureStorage {
  constructor(private readonly secrets: vscode.SecretStorage) {}

  /**
   * Store API credentials securely
   * Encrypted by OS keychain - never stored in plain text
   */
  async storeCredentials(credentials: APICredentials): Promise<void> {
    await Promise.all([
      this.secrets.store(API_KEY_STORAGE_KEY, credentials.apiKey),
      this.secrets.store(API_SECRET_STORAGE_KEY, credentials.apiSecret),
    ]);
  }

  /**
   * Retrieve API credentials from secure storage
   */
  async getCredentials(): Promise<APICredentials | null> {
    const [apiKey, apiSecret] = await Promise.all([
      this.secrets.get(API_KEY_STORAGE_KEY),
      this.secrets.get(API_SECRET_STORAGE_KEY),
    ]);

    if (!apiKey || !apiSecret) {
      return null;
    }

    return { apiKey, apiSecret };
  }

  /**
   * Remove credentials from secure storage
   */
  async deleteCredentials(): Promise<void> {
    await Promise.all([
      this.secrets.delete(API_KEY_STORAGE_KEY),
      this.secrets.delete(API_SECRET_STORAGE_KEY),
    ]);
  }

  /**
   * Check if credentials exist
   */
  async hasCredentials(): Promise<boolean> {
    const credentials = await this.getCredentials();
    return credentials !== null;
  }
}

/**
 * Regular storage for non-sensitive data
 */
export class VSCodeStorage implements IStorage {
  constructor(private readonly context: vscode.ExtensionContext) {}

  async get<T>(key: string): Promise<T | null> {
    return this.context.globalState.get<T>(key) ?? null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.context.globalState.update(key, value);
  }

  async delete(key: string): Promise<void> {
    await this.context.globalState.update(key, undefined);
  }

  async clear(): Promise<void> {
    // Clear all keys
    const keys = this.context.globalState.keys();
    await Promise.all(keys.map(key => this.context.globalState.update(key, undefined)));
  }
}

/**
 * Prompt user to enter API credentials
 * Shows clear instructions about where to get credentials
 */
export async function promptForCredentials(): Promise<APICredentials | null> {
  const apiKey = await vscode.window.showInputBox({
    prompt: 'Enter your Codeforces API Key',
    password: true,
    ignoreFocusOut: true,
    placeHolder: '40-character hexadecimal string',
    validateInput: (value) => {
      if (!value || value.length !== 40) {
        return 'API key should be 40 characters long';
      }
      if (!/^[a-f0-9]+$/i.test(value)) {
        return 'API key should be hexadecimal (0-9, a-f)';
      }
      return null;
    },
  });

  if (!apiKey) {
    return null;
  }

  const apiSecret = await vscode.window.showInputBox({
    prompt: 'Enter your Codeforces API Secret',
    password: true,
    ignoreFocusOut: true,
    placeHolder: '40-character hexadecimal string',
    validateInput: (value) => {
      if (!value || value.length !== 40) {
        return 'API secret should be 40 characters long';
      }
      if (!/^[a-f0-9]+$/i.test(value)) {
        return 'API secret should be hexadecimal (0-9, a-f)';
      }
      return null;
    },
  });

  if (!apiSecret) {
    return null;
  }

  return { apiKey, apiSecret };
}

/**
 * Show instructions for getting API credentials
 */
export async function showAPIInstructions(): Promise<void> {
  const result = await vscode.window.showInformationMessage(
    'To use authenticated Codeforces API features, you need API credentials from your profile.',
    'Open Codeforces API Settings',
    'Cancel'
  );

  if (result === 'Open Codeforces API Settings') {
    vscode.env.openExternal(vscode.Uri.parse('https://codeforces.com/settings/api'));
  }
}
