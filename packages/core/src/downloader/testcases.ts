/**
 * Test Case Extractor and Saver
 *
 * Extracts test cases from problem examples and saves them as separate files
 * Format: in1.txt, out1.txt, in2.txt, out2.txt, etc.
 */

import type { Example } from '../types';

export interface TestCaseSaveResult {
  success: boolean;
  savedCount?: number;
  files?: string[];
  error?: string;
}

/**
 * Format test case filename
 */
export function formatTestCaseFilename(index: number, type: 'input' | 'output'): string {
  const prefix = type === 'input' ? 'in' : 'out';
  return `${prefix}${index}.txt`;
}

/**
 * Prepare test cases for saving
 * Returns array of {filename, content} objects
 */
export function prepareTestCases(
  examples: Example[]
): Array<{ filename: string; content: string }> {
  const files: Array<{ filename: string; content: string }> = [];

  examples.forEach((example, index) => {
    const testNumber = index + 1;

    // Input file
    files.push({
      filename: formatTestCaseFilename(testNumber, 'input'),
      content: example.input,
    });

    // Output file
    files.push({
      filename: formatTestCaseFilename(testNumber, 'output'),
      content: example.output,
    });
  });

  return files;
}

/**
 * Generate test case metadata
 */
export function generateTestCaseMetadata(examples: Example[]): string {
  const lines: string[] = [
    '# Test Cases Metadata',
    '',
    `Total test cases: ${examples.length}`,
    `Generated: ${new Date().toISOString()}`,
    '',
    '## Test Cases',
    '',
  ];

  examples.forEach((example, index) => {
    const testNumber = index + 1;
    lines.push(`### Test Case ${testNumber}`);
    lines.push(`- Input file: ${formatTestCaseFilename(testNumber, 'input')}`);
    lines.push(`- Output file: ${formatTestCaseFilename(testNumber, 'output')}`);
    lines.push(`- Input lines: ${example.input.split('\n').length}`);
    lines.push(`- Output lines: ${example.output.split('\n').length}`);
    lines.push('');
  });

  return lines.join('\n');
}

/**
 * Validate test case content
 */
export function validateTestCase(example: Example): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check if input is empty
  if (!example.input || example.input.trim().length === 0) {
    issues.push('Input is empty');
  }

  // Check if output is empty
  if (!example.output || example.output.trim().length === 0) {
    issues.push('Output is empty');
  }

  // Check for suspiciously long lines (might indicate parsing error)
  const inputLines = example.input.split('\n');
  const outputLines = example.output.split('\n');

  const MAX_LINE_LENGTH = 10000;
  inputLines.forEach((line, idx) => {
    if (line.length > MAX_LINE_LENGTH) {
      issues.push(`Input line ${idx + 1} is unusually long (${line.length} chars)`);
    }
  });

  outputLines.forEach((line, idx) => {
    if (line.length > MAX_LINE_LENGTH) {
      issues.push(`Output line ${idx + 1} is unusually long (${line.length} chars)`);
    }
  });

  // Check for HTML tags (indicates parsing failure)
  if (/<[^>]+>/.test(example.input)) {
    issues.push('Input contains HTML tags');
  }
  if (/<[^>]+>/.test(example.output)) {
    issues.push('Output contains HTML tags');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Validate all test cases
 */
export function validateAllTestCases(examples: Example[]): {
  valid: boolean;
  totalIssues: number;
  detailedResults: Array<{
    testNumber: number;
    valid: boolean;
    issues: string[];
  }>;
} {
  const detailedResults = examples.map((example, index) => {
    const validation = validateTestCase(example);
    return {
      testNumber: index + 1,
      valid: validation.valid,
      issues: validation.issues,
    };
  });

  const totalIssues = detailedResults.reduce(
    (sum, result) => sum + result.issues.length,
    0
  );

  return {
    valid: totalIssues === 0,
    totalIssues,
    detailedResults,
  };
}

/**
 * Create test runner script content
 * Generates a simple script that users can use to test their solutions
 */
export function generateTestRunnerScript(
  examples: Example[],
  scriptType: 'bash' | 'python' | 'node' = 'bash'
): string {
  const testCount = examples.length;

  if (scriptType === 'bash') {
    return `#!/bin/bash
# Test runner script
# Usage: ./test.sh <executable>

if [ $# -eq 0 ]; then
    echo "Usage: $0 <executable>"
    echo "Example: $0 ./solution"
    exit 1
fi

EXECUTABLE="$1"
PASSED=0
FAILED=0

for i in {1..${testCount}}; do
    echo "Running test case $i..."

    OUTPUT=$($EXECUTABLE < in$i.txt)
    EXPECTED=$(cat out$i.txt)

    if [ "$OUTPUT" = "$EXPECTED" ]; then
        echo "✓ Test case $i: PASSED"
        ((PASSED++))
    else
        echo "✗ Test case $i: FAILED"
        echo "Expected:"
        echo "$EXPECTED"
        echo "Got:"
        echo "$OUTPUT"
        ((FAILED++))
    fi
    echo
done

echo "Results: $PASSED passed, $FAILED failed"
exit $FAILED
`;
  } else if (scriptType === 'python') {
    return `#!/usr/bin/env python3
"""Test runner script"""
import subprocess
import sys

def run_test(executable, test_num):
    with open(f'in{test_num}.txt', 'r') as f:
        input_data = f.read()

    with open(f'out{test_num}.txt', 'r') as f:
        expected = f.read().strip()

    result = subprocess.run(
        [executable],
        input=input_data,
        capture_output=True,
        text=True
    )

    output = result.stdout.strip()

    if output == expected:
        print(f'✓ Test case {test_num}: PASSED')
        return True
    else:
        print(f'✗ Test case {test_num}: FAILED')
        print(f'Expected:\\n{expected}')
        print(f'Got:\\n{output}')
        return False

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python test.py <executable>')
        sys.exit(1)

    executable = sys.argv[1]
    passed = 0

    for i in range(1, ${testCount + 1}):
        if run_test(executable, i):
            passed += 1
        print()

    failed = ${testCount} - passed
    print(f'Results: {passed} passed, {failed} failed')
    sys.exit(failed)
`;
  } else if (scriptType === 'node') {
    return `#!/usr/bin/env node
// Test runner script
const { execSync } = require('child_process');
const fs = require('fs');

function runTest(executable, testNum) {
    const input = fs.readFileSync(\`in\${testNum}.txt\`, 'utf-8');
    const expected = fs.readFileSync(\`out\${testNum}.txt\`, 'utf-8').trim();

    try {
        const output = execSync(executable, { input }).toString().trim();

        if (output === expected) {
            console.log(\`✓ Test case \${testNum}: PASSED\`);
            return true;
        } else {
            console.log(\`✗ Test case \${testNum}: FAILED\`);
            console.log(\`Expected:\\n\${expected}\`);
            console.log(\`Got:\\n\${output}\`);
            return false;
        }
    } catch (error) {
        console.log(\`✗ Test case \${testNum}: ERROR\`);
        console.error(error.message);
        return false;
    }
}

if (process.argv.length < 3) {
    console.log('Usage: node test.js <executable>');
    process.exit(1);
}

const executable = process.argv[2];
let passed = 0;

for (let i = 1; i <= ${testCount}; i++) {
    if (runTest(executable, i)) passed++;
    console.log();
}

const failed = ${testCount} - passed;
console.log(\`Results: \${passed} passed, \${failed} failed\`);
process.exit(failed);
`;
  }

  return '';
}

/**
 * Export test cases interface for platform-specific implementations
 */
export interface TestCaseExporter {
  saveTestCase(filename: string, content: string): Promise<void>;
  saveMetadata(metadata: string): Promise<void>;
  saveTestRunner(script: string, scriptName: string): Promise<void>;
}
