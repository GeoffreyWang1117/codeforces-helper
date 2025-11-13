/**
 * Popup UI for Browser Extension
 */

import { createAPIClient, fetchProblemHTML, ProblemScraper, createMarkdownConverter } from '@cf-dl/core';

// Simple parser for browser environment
class BrowserParserAdapter {
  querySelector(html: string, selector: string): string | null {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const element = doc.querySelector(selector);
    return element ? element.outerHTML : null;
  }

  querySelectorAll(html: string, selector: string): string[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const elements = doc.querySelectorAll(selector);
    return Array.from(elements).map((el) => el.outerHTML);
  }

  getText(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  getHTML(html: string): string {
    return html;
  }
}

const apiClient = createAPIClient();
const markdownConverter = createMarkdownConverter();
const problemScraper = new ProblemScraper(new BrowserParserAdapter());

// DOM elements
const contestIdInput = document.getElementById('contestId') as HTMLInputElement;
const problemIndexInput = document.getElementById('problemIndex') as HTMLInputElement;
const downloadBtn = document.getElementById('downloadBtn') as HTMLButtonElement;
const settingsBtn = document.getElementById('settingsBtn') as HTMLButtonElement;
const statusDiv = document.getElementById('status') as HTMLDivElement;

// Show status message
function showStatus(message: string, isError: boolean = false) {
  statusDiv.textContent = message;
  statusDiv.className = `status ${isError ? 'error' : 'success'}`;
  setTimeout(() => {
    statusDiv.className = 'status';
  }, 3000);
}

// Download problem
async function downloadProblem() {
  const contestId = parseInt(contestIdInput.value, 10);
  const problemIndex = problemIndexInput.value.trim().toUpperCase();

  if (!contestId || !problemIndex) {
    showStatus('Please enter contest ID and problem index', true);
    return;
  }

  downloadBtn.disabled = true;
  downloadBtn.textContent = '⏳ Downloading...';

  try {
    // Fetch problem HTML
    const html = await fetchProblemHTML(contestId, problemIndex);

    // Parse problem
    const result = await problemScraper.scrapeProblem(contestId, problemIndex, html);

    if (!result.success || !result.problem) {
      showStatus(`Failed: ${result.error}`, true);
      return;
    }

    // Convert to markdown
    const markdown = markdownConverter.convert(result.problem);

    // Download file
    const filename = `${contestId}-${problemIndex}.md`;

    chrome.runtime.sendMessage({
      action: 'downloadMarkdown',
      filename,
      content: markdown,
    });

    showStatus('Problem downloaded successfully!');
  } catch (error) {
    showStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, true);
  } finally {
    downloadBtn.disabled = false;
    downloadBtn.textContent = '📥 Download Problem';
  }
}

// Open settings page
function openSettings() {
  chrome.runtime.openOptionsPage();
}

// Event listeners
downloadBtn.addEventListener('click', downloadProblem);
settingsBtn.addEventListener('click', openSettings);

// Allow Enter key to trigger download
contestIdInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    downloadProblem();
  }
});

problemIndexInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    downloadProblem();
  }
});
