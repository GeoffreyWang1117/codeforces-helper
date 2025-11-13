/**
 * HTML Parser Adapter for VS Code
 * Uses linkedom - a lightweight DOM implementation (~100KB)
 */

import { parseHTML } from 'linkedom';
import type { HTMLParserAdapter } from '@cf-dl/core';

export class LinkedOMParserAdapter implements HTMLParserAdapter {
  querySelector(html: string, selector: string): string | null {
    const { document } = parseHTML(html);
    const element = document.querySelector(selector);
    return element ? element.outerHTML : null;
  }

  querySelectorAll(html: string, selector: string): string[] {
    const { document } = parseHTML(html);
    const elements = document.querySelectorAll(selector);
    return Array.from(elements).map((el) => el.outerHTML);
  }

  getText(html: string): string {
    const { document } = parseHTML(html);
    return document.body.textContent || '';
  }

  getHTML(html: string): string {
    return html;
  }
}
