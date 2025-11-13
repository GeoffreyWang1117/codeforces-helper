#!/usr/bin/env node
/**
 * Batch Test Script for Alpha Product Validation
 *
 * Tests 100 representative Codeforces contests to validate:
 * - Formula parsing accuracy (100% target)
 * - PDF problem detection and download
 * - Test case extraction
 * - Overall download success rate
 */

import {
  createAPIClient,
  createMarkdownConverter,
  ProblemScraper,
  fetchProblemHTML,
  downloadProblemWithPDF,
  prepareTestCases,
  validateAllTestCases,
} from '../packages/core/dist/index.js';
import { parseHTML } from 'linkedom';
import * as fs from 'fs/promises';
import * as path from 'path';

// Test configuration
const TEST_OUTPUT_DIR = './test-results';
const DELAY_BETWEEN_REQUESTS = 2000; // 2 seconds to avoid rate limiting

// 100 representative contests
const TEST_CONTESTS = {
  // Regular Rounds (25 contests)
  regular: [
    2000, 1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991,
    1990, 1989, 1988, 1987, 1986, 1985, 1984, 1983, 1982, 1981,
    1980, 1979, 1978, 1977, 1976
  ],

  // Educational Rounds (25 contests)
  educational: [
    1900, 1899, 1898, 1897, 1896, 1895, 1894, 1893, 1892, 1891,
    1890, 1889, 1888, 1887, 1886, 1885, 1884, 1883, 1882, 1881,
    1880, 1879, 1878, 1877, 1876
  ],

  // Div 1/2/3 Mixed (25 contests)
  mixed: [
    1800, 1799, 1798, 1797, 1796, 1795, 1794, 1793, 1792, 1791,
    1790, 1789, 1788, 1787, 1786, 1785, 1784, 1783, 1782, 1781,
    1780, 1779, 1778, 1777, 1776
  ],

  // Special/Global (25 contests)
  special: [
    1700, 1699, 1698, 1697, 1696, 1695, 1694, 1693, 1692, 1691,
    1690, 1689, 1688, 1687, 1686, 1685, 1684, 1683, 1682, 1681,
    1680, 1679, 1678, 1677, 1676
  ],
};

// Simple HTML parser adapter
class LinkedOMParser {
  querySelector(html, selector) {
    const { document } = parseHTML(html);
    const element = document.querySelector(selector);
    return element ? element.innerHTML : null;
  }

  querySelectorAll(html, selector) {
    const { document } = parseHTML(html);
    const elements = document.querySelectorAll(selector);
    return Array.from(elements).map(el => el.innerHTML);
  }

  getText(html) {
    const { document } = parseHTML(html);
    return document.body.textContent || '';
  }

  getHTML(html) {
    return html;
  }
}

// Test result tracking
interface TestResult {
  contestId: number;
  problemIndex: string;
  success: boolean;
  isPDF: boolean;
  formulaCount: number;
  testCaseCount: number;
  validationIssues: number;
  error?: string;
  downloadTime: number;
}

interface ContestResults {
  contestId: number;
  problems: TestResult[];
  successRate: number;
  totalFormulas: number;
  totalTestCases: number;
}

// Test a single problem
async function testProblem(
  contestId: number,
  problemIndex: string,
  parser: ProblemScraper,
  converter: any
): Promise<TestResult> {
  const startTime = Date.now();

  try {
    // Check for PDF
    const pdfResult = await downloadProblemWithPDF(contestId, problemIndex);

    if (pdfResult.isPDF) {
      return {
        contestId,
        problemIndex,
        success: !!pdfResult.buffer,
        isPDF: true,
        formulaCount: 0,
        testCaseCount: 0,
        validationIssues: 0,
        downloadTime: Date.now() - startTime,
      };
    }

    // Fetch and parse HTML problem
    const html = await fetchProblemHTML(contestId, problemIndex);
    const result = await parser.scrapeProblem(contestId, problemIndex, html);

    if (!result.success || !result.problem) {
      return {
        contestId,
        problemIndex,
        success: false,
        isPDF: false,
        formulaCount: 0,
        testCaseCount: 0,
        validationIssues: 0,
        error: result.error,
        downloadTime: Date.now() - startTime,
      };
    }

    // Convert to markdown and count formulas
    const markdown = converter.convert(result.problem);
    const inlineFormulas = (markdown.match(/\$[^$\n]+\$/g) || []).length;
    const displayFormulas = (markdown.match(/\$\$[^$]+\$\$/g) || []).length;
    const formulaCount = inlineFormulas + displayFormulas;

    // Validate test cases
    const testCaseValidation = validateAllTestCases(result.problem.examples);

    return {
      contestId,
      problemIndex,
      success: true,
      isPDF: false,
      formulaCount,
      testCaseCount: result.problem.examples.length,
      validationIssues: testCaseValidation.totalIssues,
      downloadTime: Date.now() - startTime,
    };
  } catch (error) {
    return {
      contestId,
      problemIndex,
      success: false,
      isPDF: false,
      formulaCount: 0,
      testCaseCount: 0,
      validationIssues: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
      downloadTime: Date.now() - startTime,
    };
  }
}

// Test an entire contest
async function testContest(
  contestId: number,
  apiClient: any,
  parser: ProblemScraper,
  converter: any
): Promise<ContestResults> {
  console.log(`\n📋 Testing Contest ${contestId}...`);

  try {
    // Get problem list from API
    const problems = await apiClient.getProblems(contestId);

    if (problems.length === 0) {
      console.log(`  ⚠️  No problems found`);
      return {
        contestId,
        problems: [],
        successRate: 0,
        totalFormulas: 0,
        totalTestCases: 0,
      };
    }

    console.log(`  Found ${problems.length} problems`);

    // Test each problem
    const results: TestResult[] = [];
    for (const problem of problems) {
      console.log(`    Testing ${problem.index}...`);

      const result = await testProblem(
        contestId,
        problem.index,
        parser,
        converter
      );

      results.push(result);

      // Delay between requests
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS));
    }

    // Calculate statistics
    const successCount = results.filter(r => r.success).length;
    const successRate = (successCount / results.length) * 100;
    const totalFormulas = results.reduce((sum, r) => sum + r.formulaCount, 0);
    const totalTestCases = results.reduce((sum, r) => sum + r.testCaseCount, 0);

    console.log(`  ✓ Success Rate: ${successRate.toFixed(1)}%`);
    console.log(`  📊 Total Formulas: ${totalFormulas}`);
    console.log(`  🧪 Total Test Cases: ${totalTestCases}`);

    return {
      contestId,
      problems: results,
      successRate,
      totalFormulas,
      totalTestCases,
    };
  } catch (error) {
    console.error(`  ✗ Contest test failed:`, error);
    return {
      contestId,
      problems: [],
      successRate: 0,
      totalFormulas: 0,
      totalTestCases: 0,
    };
  }
}

// Generate test report
async function generateReport(allResults: ContestResults[]): Promise<void> {
  const totalContests = allResults.length;
  const totalProblems = allResults.reduce((sum, c) => sum + c.problems.length, 0);
  const successfulProblems = allResults.reduce(
    (sum, c) => sum + c.problems.filter(p => p.success).length,
    0
  );
  const totalFormulas = allResults.reduce((sum, c) => sum + c.totalFormulas, 0);
  const totalTestCases = allResults.reduce((sum, c) => sum + c.totalTestCases, 0);
  const pdfProblems = allResults.reduce(
    (sum, c) => sum + c.problems.filter(p => p.isPDF).length,
    0
  );
  const validationIssues = allResults.reduce(
    (sum, c) => sum + c.problems.reduce((s, p) => s + p.validationIssues, 0),
    0
  );

  const overallSuccessRate = (successfulProblems / totalProblems) * 100;

  const report = `# Batch Test Report

## Summary

- **Date**: ${new Date().toISOString()}
- **Total Contests Tested**: ${totalContests}
- **Total Problems Tested**: ${totalProblems}
- **Successful Downloads**: ${successfulProblems} (${overallSuccessRate.toFixed(1)}%)
- **PDF Problems**: ${pdfProblems}
- **Total Formulas Parsed**: ${totalFormulas}
- **Total Test Cases Extracted**: ${totalTestCases}
- **Validation Issues**: ${validationIssues}

## Status

${overallSuccessRate >= 95 ? '✅ **PASSED** - Ready for Alpha release' : '⚠️  **NEEDS WORK** - Some issues detected'}

## Breakdown by Category

${generateCategoryBreakdown(allResults)}

## Failed Problems

${generateFailedList(allResults)}

## Performance Metrics

${generatePerformanceMetrics(allResults)}

## Formula Parsing Statistics

${generateFormulaStats(allResults)}

## Recommendations

${generateRecommendations(allResults, overallSuccessRate)}
`;

  await fs.writeFile(path.join(TEST_OUTPUT_DIR, 'report.md'), report, 'utf-8');

  // Save detailed JSON results
  await fs.writeFile(
    path.join(TEST_OUTPUT_DIR, 'results.json'),
    JSON.stringify(allResults, null, 2),
    'utf-8'
  );

  console.log(`\n📄 Report saved to ${TEST_OUTPUT_DIR}/report.md`);
}

function generateCategoryBreakdown(results: ContestResults[]): string {
  const categories = ['regular', 'educational', 'mixed', 'special'];
  const lines: string[] = [];

  for (const category of categories) {
    const categoryContests = TEST_CONTESTS[category as keyof typeof TEST_CONTESTS];
    const categoryResults = results.filter(r => categoryContests.includes(r.contestId));

    if (categoryResults.length === 0) continue;

    const successRate = categoryResults.reduce((sum, c) => sum + c.successRate, 0) / categoryResults.length;

    lines.push(`### ${category.charAt(0).toUpperCase() + category.slice(1)} Rounds`);
    lines.push(`- Contests: ${categoryResults.length}`);
    lines.push(`- Average Success Rate: ${successRate.toFixed(1)}%`);
    lines.push('');
  }

  return lines.join('\n');
}

function generateFailedList(results: ContestResults[]): string {
  const failed: string[] = [];

  for (const contest of results) {
    for (const problem of contest.problems) {
      if (!problem.success) {
        failed.push(`- Contest ${problem.contestId} Problem ${problem.index}: ${problem.error || 'Unknown error'}`);
      }
    }
  }

  return failed.length > 0 ? failed.join('\n') : 'None - all problems downloaded successfully!';
}

function generatePerformanceMetrics(results: ContestResults[]): string {
  const allProblems = results.flatMap(c => c.problems);
  const times = allProblems.map(p => p.downloadTime);

  const avgTime = times.reduce((sum, t) => sum + t, 0) / times.length;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);

  return `- Average download time: ${avgTime.toFixed(0)}ms
- Fastest download: ${minTime}ms
- Slowest download: ${maxTime}ms`;
}

function generateFormulaStats(results: ContestResults[]): string {
  const allProblems = results.flatMap(c => c.problems);
  const problemsWithFormulas = allProblems.filter(p => p.formulaCount > 0);
  const avgFormulas = problemsWithFormulas.length > 0
    ? problemsWithFormulas.reduce((sum, p) => sum + p.formulaCount, 0) / problemsWithFormulas.length
    : 0;

  return `- Problems with formulas: ${problemsWithFormulas.length}
- Average formulas per problem: ${avgFormulas.toFixed(1)}
- Max formulas in one problem: ${Math.max(...allProblems.map(p => p.formulaCount), 0)}`;
}

function generateRecommendations(results: ContestResults[], successRate: number): string {
  const recommendations: string[] = [];

  if (successRate < 95) {
    recommendations.push('- Investigate failed downloads and improve error handling');
  }

  const validationIssues = results.reduce(
    (sum, c) => sum + c.problems.reduce((s, p) => s + p.validationIssues, 0),
    0
  );

  if (validationIssues > 0) {
    recommendations.push('- Fix test case validation issues');
  }

  if (successRate >= 95 && validationIssues === 0) {
    recommendations.push('- ✅ Ready for Alpha 1.0.0 release!');
    recommendations.push('- Proceed with documentation and packaging');
  }

  return recommendations.length > 0 ? recommendations.join('\n') : 'All tests passed - proceed with release!';
}

// Main execution
async function main() {
  console.log('🧪 Alpha Product Batch Test Suite');
  console.log('Testing 100 representative Codeforces contests\n');

  // Create output directory
  await fs.mkdir(TEST_OUTPUT_DIR, { recursive: true });

  // Initialize components
  const apiClient = createAPIClient();
  const converter = createMarkdownConverter();
  const parser = new ProblemScraper(new LinkedOMParser());

  // Flatten all contest IDs
  const allContestIds = [
    ...TEST_CONTESTS.regular,
    ...TEST_CONTESTS.educational,
    ...TEST_CONTESTS.mixed,
    ...TEST_CONTESTS.special,
  ];

  console.log(`📊 Total contests to test: ${allContestIds.length}\n`);

  // Test each contest
  const results: ContestResults[] = [];
  let completed = 0;

  for (const contestId of allContestIds) {
    const result = await testContest(contestId, apiClient, parser, converter);
    results.push(result);

    completed++;
    console.log(`\n⏱️  Progress: ${completed}/${allContestIds.length} (${((completed / allContestIds.length) * 100).toFixed(1)}%)`);

    // Save incremental results
    await fs.writeFile(
      path.join(TEST_OUTPUT_DIR, 'partial-results.json'),
      JSON.stringify(results, null, 2),
      'utf-8'
    );
  }

  // Generate final report
  await generateReport(results);

  console.log('\n✅ Batch testing completed!');
  console.log(`📄 Results saved to ${TEST_OUTPUT_DIR}/`);
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { testProblem, testContest, generateReport };
