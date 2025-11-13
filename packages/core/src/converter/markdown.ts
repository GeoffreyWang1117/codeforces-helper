/**
 * Markdown Converter
 *
 * Converts problem details to Markdown format
 * Supports LaTeX formulas and custom templates
 */

import type { ProblemDetails } from '../types';

export interface MarkdownTemplate {
  title: string;
  includeMetadata?: boolean;
  includeExamples?: boolean;
  includeTags?: boolean;
  includeNotes?: boolean;
}

export class MarkdownConverter {
  /**
   * Convert problem to Markdown format
   */
  convert(problem: ProblemDetails, template?: Partial<MarkdownTemplate>): string {
    const config: MarkdownTemplate = {
      title: problem.name,
      includeMetadata: true,
      includeExamples: true,
      includeTags: false,
      includeNotes: true,
      ...template,
    };

    const sections: string[] = [];

    // Title
    sections.push(`# ${config.title}\n`);

    // Metadata
    if (config.includeMetadata) {
      sections.push(this.generateMetadata(problem));
    }

    // Problem Statement
    sections.push(`## Problem Statement\n`);
    sections.push(this.convertLatex(problem.statement));
    sections.push('');

    // Input Format
    if (problem.inputFormat) {
      sections.push(`## Input\n`);
      sections.push(this.convertLatex(problem.inputFormat));
      sections.push('');
    }

    // Output Format
    if (problem.outputFormat) {
      sections.push(`## Output\n`);
      sections.push(this.convertLatex(problem.outputFormat));
      sections.push('');
    }

    // Examples
    if (config.includeExamples && problem.examples.length > 0) {
      sections.push(this.generateExamples(problem));
    }

    // Notes
    if (config.includeNotes && problem.notes) {
      sections.push(`## Notes\n`);
      sections.push(this.convertLatex(problem.notes));
      sections.push('');
    }

    // Tags
    if (config.includeTags && problem.tags.length > 0) {
      sections.push(this.generateTags(problem.tags));
    }

    return sections.join('\n');
  }

  /**
   * Generate metadata section
   */
  private generateMetadata(problem: ProblemDetails): string {
    const metadata: string[] = [];

    metadata.push(`**Contest**: ${problem.contestId} | **Problem**: ${problem.index}`);

    if (problem.rating) {
      metadata.push(` | **Rating**: ${problem.rating}`);
    }

    metadata.push('\n');

    if (problem.timeLimit) {
      metadata.push(`**Time Limit**: ${problem.timeLimit}`);
    }

    if (problem.memoryLimit) {
      metadata.push(` | **Memory Limit**: ${problem.memoryLimit}`);
    }

    metadata.push('\n');

    return metadata.join('') + '\n';
  }

  /**
   * Generate examples section
   */
  private generateExamples(problem: ProblemDetails): string {
    const examples: string[] = [`## Examples\n`];

    problem.examples.forEach((example, index) => {
      examples.push(`### Example ${index + 1}\n`);
      examples.push(`**Input**:\n\`\`\`\n${example.input}\n\`\`\`\n`);
      examples.push(`**Output**:\n\`\`\`\n${example.output}\n\`\`\`\n`);
    });

    return examples.join('\n');
  }

  /**
   * Generate tags section
   */
  private generateTags(tags: string[]): string {
    const tagsList = tags.map(tag => `\`${tag}\``).join(', ');
    return `## Tags\n\n${tagsList}\n`;
  }

  /**
   * Convert HTML with LaTeX formulas to Markdown
   */
  private convertLatex(html: string): string {
    let text = html;

    // Convert Codeforces formula format: $$$...$$$ -> $...$
    text = text.replace(/\$\$\$(.*?)\$\$\$/g, '$$$1$$');

    // Convert LaTeX delimiters: \( \) -> $ $
    text = text.replace(/\\\((.*?)\\\)/g, '$$$1$$');

    // Convert LaTeX delimiters: \[ \] -> $$ $$
    text = text.replace(/\\\[(.*?)\\\]/g, '$$$$$$1$$$$');

    // Clean up HTML tags (basic)
    text = text.replace(/<sup>(.*?)<\/sup>/g, '^$1');
    text = text.replace(/<sub>(.*?)<\/sub>/g, '_$1');
    text = text.replace(/<i>(.*?)<\/i>/g, '*$1*');
    text = text.replace(/<b>(.*?)<\/b>/g, '**$1**');
    text = text.replace(/<br\s*\/?>/g, '\n');
    text = text.replace(/<p>(.*?)<\/p>/g, '$1\n\n');

    // Remove remaining HTML tags
    text = text.replace(/<[^>]+>/g, '');

    // Clean up excessive newlines
    text = text.replace(/\n{3,}/g, '\n\n');

    return text.trim();
  }
}

/**
 * Create a markdown converter instance
 */
export function createMarkdownConverter(): MarkdownConverter {
  return new MarkdownConverter();
}
