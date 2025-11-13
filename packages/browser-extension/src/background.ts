/**
 * Background Service Worker for Browser Extension
 *
 * PRIVACY GUARANTEE:
 * - All data stored locally using chrome.storage.local
 * - Credentials encrypted by browser
 * - No external servers or analytics
 */

import type { APICredentials } from '@cf-dl/core';

// Context menu setup
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu for Codeforces pages
  chrome.contextMenus.create({
    id: 'download-problem',
    title: 'Download Current Problem',
    contexts: ['page'],
    documentUrlPatterns: ['https://codeforces.com/contest/*/problem/*'],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'download-problem' && tab?.id) {
    // Send message to content script to download problem
    chrome.tabs.sendMessage(tab.id, { action: 'downloadProblem' });
  }
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'downloadMarkdown') {
    // Trigger download
    downloadMarkdown(message.filename, message.content);
    sendResponse({ success: true });
  }
  return true;
});

/**
 * Download markdown file
 */
function downloadMarkdown(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);

  chrome.downloads.download({
    url,
    filename,
    saveAs: true,
  });
}

/**
 * Secure storage for API credentials
 * Uses chrome.storage.local (encrypted by browser)
 */
export async function storeCredentials(credentials: APICredentials): Promise<void> {
  await chrome.storage.local.set({
    apiKey: credentials.apiKey,
    apiSecret: credentials.apiSecret,
  });
}

export async function getCredentials(): Promise<APICredentials | null> {
  const result = await chrome.storage.local.get(['apiKey', 'apiSecret']);

  if (result.apiKey && result.apiSecret) {
    return {
      apiKey: result.apiKey,
      apiSecret: result.apiSecret,
    };
  }

  return null;
}

export async function clearCredentials(): Promise<void> {
  await chrome.storage.local.remove(['apiKey', 'apiSecret']);
}
