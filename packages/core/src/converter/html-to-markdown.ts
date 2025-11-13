/**
 * Enhanced HTML to Markdown Converter
 * Specifically designed for Codeforces problem pages
 *
 * Features:
 * - Preserves LaTeX formulas
 * - Handles Codeforces-specific HTML classes
 * - Converts special characters
 * - Validates formula syntax
 */

export interface ConversionOptions {
  preserveLatex?: boolean;      // Keep LaTeX formulas as-is (default: true)
  validateFormulas?: boolean;   // Validate LaTeX syntax (default: true)
  includeMathDelimiters?: boolean; // Add $ delimiters (default: true)
}

export interface FormulaInfo {
  content: string;
  type: 'inline' | 'block';
  valid: boolean;
  error?: string;
}

/**
 * HTML to Markdown converter with LaTeX support
 */
export class HTMLToMarkdownConverter {
  private options: Required<ConversionOptions>;
  private formulasFound: FormulaInfo[] = [];

  constructor(options: ConversionOptions = {}) {
    this.options = {
      preserveLatex: options.preserveLatex ?? true,
      validateFormulas: options.validateFormulas ?? true,
      includeMathDelimiters: options.includeMathDelimiters ?? true,
    };
  }

  /**
   * Convert HTML to Markdown
   */
  convert(html: string): string {
    this.formulasFound = [];

    let markdown = html;

    // Step 1: Extract and preserve LaTeX formulas
    markdown = this.preserveLatexFormulas(markdown);

    // Step 2: Convert HTML structure to Markdown
    markdown = this.convertHTMLStructure(markdown);

    // Step 3: Convert inline formatting
    markdown = this.convertInlineFormatting(markdown);

    // Step 4: Clean up
    markdown = this.cleanup(markdown);

    return markdown;
  }

  /**
   * Get all formulas found during conversion
   */
  getFormulas(): FormulaInfo[] {
    return this.formulasFound;
  }

  /**
   * Preserve LaTeX formulas from Codeforces HTML
   */
  private preserveLatexFormulas(html: string): string {
    let text = html;

    // Pattern 1: <span class="tex-font-size-*">$...$</span>
    text = text.replace(
      /<span class="tex-font-size-[^"]*">\$([^$]+)\$<\/span>/g,
      (match, formula) => {
        this.recordFormula(formula, 'inline');
        return this.options.includeMathDelimiters ? `$${formula}$` : formula;
      }
    );

    // Pattern 2: <span class="tex-font-style-*">$...$</span>
    text = text.replace(
      /<span class="tex-font-style-[^"]*">\$([^$]+)\$<\/span>/g,
      (match, formula) => {
        this.recordFormula(formula, 'inline');
        return this.options.includeMathDelimiters ? `$${formula}$` : formula;
      }
    );

    // Pattern 3: Standalone LaTeX: $...$
    text = text.replace(/\$([^$]+)\$/g, (match, formula) => {
      this.recordFormula(formula, 'inline');
      return this.options.includeMathDelimiters ? `$${formula}$` : formula;
    });

    // Pattern 4: Display math: $$...$$
    text = text.replace(/\$\$([^$]+)\$\$/g, (match, formula) => {
      this.recordFormula(formula, 'block');
      return this.options.includeMathDelimiters ? `$$${formula}$$` : formula;
    });

    // Pattern 5: LaTeX delimiters \( \) -> $ $
    text = text.replace(/\\\(([^)]+)\\\)/g, (match, formula) => {
      this.recordFormula(formula, 'inline');
      return this.options.includeMathDelimiters ? `$${formula}$` : formula;
    });

    // Pattern 6: LaTeX delimiters \[ \] -> $$ $$
    text = text.replace(/\\\[([^\]]+)\\\]/g, (match, formula) => {
      this.recordFormula(formula, 'block');
      return this.options.includeMathDelimiters ? `$$${formula}$$` : formula;
    });

    // Pattern 7: Codeforces triple dollar: $$$...$$$
    text = text.replace(/\$\$\$([^$]+)\$\$\$/g, (match, formula) => {
      this.recordFormula(formula, 'block');
      return this.options.includeMathDelimiters ? `$$${formula}$$` : formula;
    });

    return text;
  }

  /**
   * Convert HTML structure elements
   */
  private convertHTMLStructure(html: string): string {
    let text = html;

    // Headers (preserve existing #)
    text = text.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n');
    text = text.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n');
    text = text.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n');
    text = text.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '\n#### $1\n');

    // Paragraphs
    text = text.replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n');
    text = text.replace(/<div[^>]*>(.*?)<\/div>/gi, '\n$1\n');

    // Line breaks
    text = text.replace(/<br\s*\/?>/gi, '\n');

    // Lists
    text = text.replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, content) => {
      return '\n' + content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n') + '\n';
    });

    text = text.replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, content) => {
      let counter = 1;
      return (
        '\n' + content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${counter++}. $1\n`) + '\n'
      );
    });

    // Code blocks
    text = text.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '\n```\n$1\n```\n');
    text = text.replace(/<pre[^>]*>(.*?)<\/pre>/gis, '\n```\n$1\n```\n');

    // Blockquotes
    text = text.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (match, content) => {
      return '\n' + content.split('\n').map(line => `> ${line}`).join('\n') + '\n';
    });

    // Tables (basic support)
    text = text.replace(/<table[^>]*>(.*?)<\/table>/gis, (match, content) => {
      // Simple table conversion - can be enhanced
      return '\n' + content + '\n';
    });

    return text;
  }

  /**
   * Convert inline formatting
   */
  private convertInlineFormatting(html: string): string {
    let text = html;

    // Bold
    text = text.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    text = text.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');

    // Italic
    text = text.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
    text = text.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');

    // Underline (use HTML since Markdown doesn't support it natively)
    text = text.replace(/<u[^>]*>(.*?)<\/u>/gi, '<u>$1</u>');

    // Strike through
    text = text.replace(/<s[^>]*>(.*?)<\/s>/gi, '~~$1~~');
    text = text.replace(/<strike[^>]*>(.*?)<\/strike>/gi, '~~$1~~');
    text = text.replace(/<del[^>]*>(.*?)<\/del>/gi, '~~$1~~');

    // Inline code
    text = text.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

    // Superscript and subscript
    text = text.replace(/<sup[^>]*>(.*?)<\/sup>/gi, '^$1^');
    text = text.replace(/<sub[^>]*>(.*?)<\/sub>/gi, '~$1~');

    // Links
    text = text.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

    // Images
    text = text.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)');
    text = text.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)');

    // Codeforces specific: tex-span
    text = text.replace(/<span class="tex-span">(.*?)<\/span>/gi, '$1');

    // Remove all other spans
    text = text.replace(/<span[^>]*>(.*?)<\/span>/gi, '$1');

    // Remove all other HTML tags
    text = text.replace(/<[^>]+>/g, '');

    return text;
  }

  /**
   * Clean up the converted text
   */
  private cleanup(text: string): string {
    let cleaned = text;

    // Decode HTML entities
    cleaned = this.decodeHTMLEntities(cleaned);

    // Remove excessive whitespace
    cleaned = cleaned.replace(/[ \t]+/g, ' ');

    // Remove excessive newlines (max 2)
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

    // Trim each line
    cleaned = cleaned
      .split('\n')
      .map(line => line.trim())
      .join('\n');

    // Final trim
    cleaned = cleaned.trim();

    return cleaned;
  }

  /**
   * Decode HTML entities
   */
  private decodeHTMLEntities(text: string): string {
    const entities: Record<string, string> = {
      '&lt;': '<',
      '&gt;': '>',
      '&amp;': '&',
      '&quot;': '"',
      '&#39;': "'",
      '&nbsp;': ' ',
      '&ndash;': '–',
      '&mdash;': '—',
      '&hellip;': '…',
      '&le;': '≤',
      '&ge;': '≥',
      '&times;': '×',
      '&divide;': '÷',
      '&ne;': '≠',
      '&equiv;': '≡',
      '&sum;': '∑',
      '&prod;': '∏',
      '&int;': '∫',
      '&infin;': '∞',
      '&pm;': '±',
      '&radic;': '√',
      '&lfloor;': '⌊',
      '&rfloor;': '⌋',
      '&lceil;': '⌈',
      '&rceil;': '⌉',
    };

    let decoded = text;

    // Replace named entities
    for (const [entity, char] of Object.entries(entities)) {
      decoded = decoded.replace(new RegExp(entity, 'g'), char);
    }

    // Replace numeric entities &#123;
    decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
      return String.fromCharCode(parseInt(dec, 10));
    });

    // Replace hex entities &#x1F;
    decoded = decoded.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });

    return decoded;
  }

  /**
   * Record a formula for validation
   */
  private recordFormula(content: string, type: 'inline' | 'block'): void {
    const formula: FormulaInfo = {
      content,
      type,
      valid: true,
    };

    if (this.options.validateFormulas) {
      const validation = this.validateLatex(content);
      formula.valid = validation.valid;
      formula.error = validation.error;
    }

    this.formulasFound.push(formula);
  }

  /**
   * Validate LaTeX syntax (basic validation)
   */
  private validateLatex(latex: string): { valid: boolean; error?: string } {
    // Check for balanced braces
    let braceCount = 0;
    let bracketCount = 0;

    for (const char of latex) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      if (char === '[') bracketCount++;
      if (char === ']') bracketCount--;

      if (braceCount < 0) {
        return { valid: false, error: 'Unbalanced closing brace }' };
      }
      if (bracketCount < 0) {
        return { valid: false, error: 'Unbalanced closing bracket ]' };
      }
    }

    if (braceCount !== 0) {
      return { valid: false, error: `Unbalanced braces (${braceCount > 0 ? 'missing }' : 'extra }'})` };
    }

    if (bracketCount !== 0) {
      return { valid: false, error: `Unbalanced brackets (${bracketCount > 0 ? 'missing ]' : 'extra ]'})` };
    }

    // Check for common LaTeX commands
    const invalidCommands = latex.match(/\\[a-zA-Z]+/g);
    if (invalidCommands) {
      const knownCommands = [
        '\\frac', '\\sqrt', '\\sum', '\\prod', '\\int', '\\lim',
        '\\sin', '\\cos', '\\tan', '\\log', '\\ln', '\\exp',
        '\\left', '\\right', '\\begin', '\\end',
        '\\alpha', '\\beta', '\\gamma', '\\delta', '\\epsilon',
        '\\leq', '\\geq', '\\neq', '\\approx', '\\equiv',
        '\\infty', '\\pm', '\\times', '\\div',
        '\\mathbb', '\\mathcal', '\\mathbf', '\\mathrm',
        '\\text', '\\textit', '\\textbf',
        '\\cdot', '\\ldots', '\\dots',
      ];

      for (const cmd of invalidCommands) {
        if (!knownCommands.some(known => known === cmd.toLowerCase())) {
          // Not necessarily invalid, just not in our known list
          // Could log a warning here
        }
      }
    }

    return { valid: true };
  }
}

/**
 * Create HTML to Markdown converter
 */
export function createHTMLToMarkdownConverter(
  options?: ConversionOptions
): HTMLToMarkdownConverter {
  return new HTMLToMarkdownConverter(options);
}

/**
 * Quick conversion function
 */
export function htmlToMarkdown(html: string, options?: ConversionOptions): string {
  const converter = new HTMLToMarkdownConverter(options);
  return converter.convert(html);
}
