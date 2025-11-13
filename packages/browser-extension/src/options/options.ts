/**
 * Options/Settings page for browser extension
 * Manages API credentials securely
 */

import { createAPIClient, validateCredentialsFormat } from '@cf-dl/core';

const apiClient = createAPIClient();

// DOM elements
const apiKeyInput = document.getElementById('apiKey') as HTMLInputElement;
const apiSecretInput = document.getElementById('apiSecret') as HTMLInputElement;
const saveBtn = document.getElementById('saveBtn') as HTMLButtonElement;
const clearBtn = document.getElementById('clearBtn') as HTMLButtonElement;
const statusDiv = document.getElementById('status') as HTMLDivElement;

// Show status message
function showStatus(message: string, isError: boolean = false) {
  statusDiv.textContent = message;
  statusDiv.className = `status ${isError ? 'error' : 'success'}`;
}

// Load existing credentials
async function loadCredentials() {
  const result = await chrome.storage.local.get(['apiKey', 'apiSecret']);

  if (result.apiKey && result.apiSecret) {
    apiKeyInput.value = result.apiKey;
    apiSecretInput.value = result.apiSecret;
  }
}

// Save credentials
async function saveCredentials() {
  const apiKey = apiKeyInput.value.trim();
  const apiSecret = apiSecretInput.value.trim();

  // Validate format
  if (!validateCredentialsFormat(apiKey, apiSecret)) {
    showStatus('Invalid credentials format. Both should be 40-character hex strings.', true);
    return;
  }

  saveBtn.disabled = true;
  saveBtn.textContent = '⏳ Testing...';

  // Test credentials
  const isValid = await apiClient.testCredentials({ apiKey, apiSecret });

  if (!isValid) {
    showStatus('Invalid credentials. Please check your API key and secret.', true);
    saveBtn.disabled = false;
    saveBtn.textContent = '💾 Save Credentials';
    return;
  }

  // Save to storage
  await chrome.storage.local.set({ apiKey, apiSecret });

  showStatus('Credentials saved successfully! ✅');
  saveBtn.disabled = false;
  saveBtn.textContent = '💾 Save Credentials';
}

// Clear credentials
async function clearCredentials() {
  const confirmed = confirm('Are you sure you want to clear your API credentials?');

  if (confirmed) {
    await chrome.storage.local.remove(['apiKey', 'apiSecret']);
    apiKeyInput.value = '';
    apiSecretInput.value = '';
    showStatus('Credentials cleared');
  }
}

// Event listeners
saveBtn.addEventListener('click', saveCredentials);
clearBtn.addEventListener('click', clearCredentials);

// Load credentials on page load
loadCredentials();
