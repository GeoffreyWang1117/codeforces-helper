/**
 * HTML Parser for Codeforces Problem Pages
 *
 * Scrapes problem details from HTML pages
 * All parsing happens locally - no external services
 */

import type { ProblemDetails, Example, ScraperResult } from '../types';

export interface HTMLParserAdapter {
  /**
   * Parse HTML string and extract text content by selector
   */
  querySelector(html: string, selector: string): string | null;

  /**
   * Parse HTML string and extract all matching elements
   */
  querySelectorAll(html: string, selector: string): string[];

  /**
   * Get text content from HTML
   */
  getText(html: string): string;

  /**
   * Get inner HTML
   */
  getHTML(html: string): string;
}

export class ProblemScraper {
  constructor(private parser: HTMLParserAdapter) {}

  /**
   * Scrape problem details from Codeforces problem page HTML
   */
  async scrapeProblem(contestId: number, index: string, html: string): Promise<ScraperResult> {
    try {
      // Extract problem statement
      const statementDiv = this.parser.querySelector(html, '.problem-statement');
      if (!statementDiv) {
        return {
          success: false,
          error: 'Problem statement not found. Page structure may have changed.',
        };
      }

      // Extract title
      const titleDiv = this.parser.querySelector(statementDiv, '.title');
      const name = titleDiv ? this.parser.getText(titleDiv).trim() : `Problem ${index}`;

      // Extract time and memory limits
      const timeLimitDiv = this.parser.querySelector(statementDiv, '.time-limit');
      const memoryLimitDiv = this.parser.querySelector(statementDiv, '.memory-limit');

      const timeLimit = timeLimitDiv ? this.extractLimit(this.parser.getText(timeLimitDiv)) : 'N/A';
      const memoryLimit = memoryLimitDiv
        ? this.extractLimit(this.parser.getText(memoryLimitDiv))
        : 'N/A';

      // Extract statement sections
      const statement = this.extractSection(statementDiv, 'No section header');
      const inputFormat = this.extractSection(html, 'Input') || '';
      const outputFormat = this.extractSection(html, 'Output') || '';
      const notes = this.extractSection(html, 'Note');

      // Extract examples
      const examples = this.extractExamples(html);

      const problem: ProblemDetails = {
        contestId,
        index,
        name,
        type: 'PROGRAMMING',
        tags: [],
        statement,
        inputFormat,
        outputFormat,
        examples,
        notes,
        timeLimit,
        memoryLimit,
      };

      return {
        success: true,
        problem,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during scraping',
      };
    }
  }

  /**
   * Extract examples from HTML
   */
  private extractExamples(html: string): Example[] {
    const examples: Example[] = [];

    // Find all input divs
    const inputDivs = this.parser.querySelectorAll(html, '.input');
    const outputDivs = this.parser.querySelectorAll(html, '.output');

    const count = Math.min(inputDivs.length, outputDivs.length);

    for (let i = 0; i < count; i++) {
      const inputPre = this.parser.querySelector(inputDivs[i], 'pre');
      const outputPre = this.parser.querySelector(outputDivs[i], 'pre');

      if (inputPre && outputPre) {
        examples.push({
          input: this.parser.getText(inputPre).trim(),
          output: this.parser.getText(outputPre).trim(),
        });
      }
    }

    return examples;
  }

  /**
   * Extract a section by header text
   * Now returns HTML to preserve LaTeX formulas
   */
  private extractSection(html: string, headerText: string): string | undefined {
    // This is a simplified implementation
    // In practice, you'd want to find the div with class matching the header
    // and extract its content

    const divClass = `.${headerText.toLowerCase().replace(/\s+/g, '-')}`;
    const sectionDiv = this.parser.querySelector(html, divClass);

    if (sectionDiv) {
      // Use getHTML() instead of getText() to preserve formulas and structure
      return this.parser.getHTML(sectionDiv).trim();
    }

    return undefined;
  }

  /**
   * Extract limit value (e.g., "2 seconds" from "time limit per test2 seconds")
   */
  private extractLimit(text: string): string {
    const match = text.match(/(\d+\s*\w+)$/);
    return match ? match[1] : text;
  }
}

/**
 * Fetch problem HTML from Codeforces
 */
export async function fetchProblemHTML(contestId: number, index: string): Promise<string> {
  const url = `https://codeforces.com/contest/${contestId}/problem/${index}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const html = await response.text();

  // Check for Cloudflare protection
  if (html.includes('Just a moment') || html.includes('cf-browser-verification')) {
    throw new Error('Cloudflare protection detected. Cannot fetch problem.');
  }

  return html;
}
