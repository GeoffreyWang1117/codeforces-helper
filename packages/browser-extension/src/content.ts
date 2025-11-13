/**
 * Content Script - Injects download button on Codeforces problem pages
 * Runs directly on codeforces.com pages
 */

import { createMarkdownConverter, ProblemScraper } from '@cf-dl/core';

// Simple DOM parser adapter for browser
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

const markdownConverter = createMarkdownConverter();
const problemScraper = new ProblemScraper(new BrowserParserAdapter());

// Extract contest ID and problem index from URL
function extractProblemInfo(): { contestId: number; index: string } | null {
  const match = window.location.pathname.match(/\/contest\/(\d+)\/problem\/([A-Z]\d*)/);
  if (match) {
    return {
      contestId: parseInt(match[1], 10),
      index: match[2],
    };
  }
  return null;
}

// Download current problem
async function downloadCurrentProblem() {
  const info = extractProblemInfo();
  if (!info) {
    alert('Could not extract problem information from URL');
    return;
  }

  try {
    // Get page HTML
    const html = document.documentElement.outerHTML;

    // Parse problem
    const result = await problemScraper.scrapeProblem(info.contestId, info.index, html);

    if (!result.success || !result.problem) {
      alert(`Failed to parse problem: ${result.error}`);
      return;
    }

    // Convert to markdown
    const markdown = markdownConverter.convert(result.problem);

    // Send to background script for download
    const filename = `${info.contestId}-${info.index}.md`;

    chrome.runtime.sendMessage({
      action: 'downloadMarkdown',
      filename,
      content: markdown,
    });
  } catch (error) {
    console.error('Error downloading problem:', error);
    alert('Failed to download problem. Check console for details.');
  }
}

// Add download button to page
function addDownloadButton() {
  // Check if button already exists
  if (document.getElementById('cf-dl-button')) {
    return;
  }

  // Find problem statement div
  const problemStatement = document.querySelector('.problem-statement');
  if (!problemStatement) {
    return;
  }

  // Create button
  const button = document.createElement('button');
  button.id = 'cf-dl-button';
  button.className = 'cf-dl-download-btn';
  button.textContent = '📥 Download as Markdown';
  button.addEventListener('click', downloadCurrentProblem);

  // Insert button before problem statement
  problemStatement.parentElement?.insertBefore(button, problemStatement);
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'downloadProblem') {
    downloadCurrentProblem();
  }
});

// Add button when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addDownloadButton);
} else {
  addDownloadButton();
}
