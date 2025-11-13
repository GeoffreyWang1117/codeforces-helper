/**
 * Downloader Module
 *
 * Handles downloading of problems, PDFs, and test cases
 */

// PDF downloading
export {
  detectPDFProblem,
  downloadPDF,
  fetchPDFBuffer,
  downloadProblemWithPDF,
} from './pdf';

export type {
  PDFDetectionResult,
  PDFDownloadResult,
} from './pdf';

// Test case extraction and saving
export {
  formatTestCaseFilename,
  prepareTestCases,
  generateTestCaseMetadata,
  validateTestCase,
  validateAllTestCases,
  generateTestRunnerScript,
} from './testcases';

export type {
  TestCaseSaveResult,
  TestCaseExporter,
} from './testcases';
