/**
 * Codeforces Downloader - VS Code Extension
 *
 * PRIVACY POLICY:
 * ==============
 * - All data processing happens locally on your machine
 * - API credentials are stored securely in OS keychain
 * - No telemetry, no analytics, no data collection
 * - All requests go directly to codeforces.com
 * - Extension developers cannot access your credentials
 * - Open source - you can audit the code
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';
import {
  createAPIClient,
  createMarkdownConverter,
  ProblemScraper,
  fetchProblemHTML,
} from '@cf-dl/core';
import { VSCodeSecureStorage, promptForCredentials, showAPIInstructions } from './storage';
import { LinkedOMParserAdapter } from './parser-adapter';

let secureStorage: VSCodeSecureStorage;
const apiClient = createAPIClient();
const markdownConverter = createMarkdownConverter();
const problemScraper = new ProblemScraper(new LinkedOMParserAdapter());

export async function activate(context: vscode.ExtensionContext) {
  console.log('Codeforces Downloader extension activated');

  // Initialize secure storage
  secureStorage = new VSCodeSecureStorage(context.secrets);

  // Load credentials if available
  const credentials = await secureStorage.getCredentials();
  if (credentials) {
    apiClient.setCredentials(credentials);
  }

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('codeforces.downloadContest', downloadContest),
    vscode.commands.registerCommand('codeforces.downloadProblem', downloadProblem),
    vscode.commands.registerCommand('codeforces.configureAPI', configureAPI),
    vscode.commands.registerCommand('codeforces.clearCredentials', clearCredentials)
  );
}

/**
 * Download all problems from a contest
 */
async function downloadContest() {
  // Get contest ID from user
  const contestIdInput = await vscode.window.showInputBox({
    prompt: 'Enter Contest ID',
    placeHolder: 'e.g., 2000',
    validateInput: (value) => {
      if (!value || !/^\d+$/.test(value)) {
        return 'Please enter a valid contest ID';
      }
      return null;
    },
  });

  if (!contestIdInput) {
    return;
  }

  const contestId = parseInt(contestIdInput, 10);

  // Get save location
  const saveFolder = await getSaveFolder();
  if (!saveFolder) {
    return;
  }

  // Create contest folder
  const contestFolder = path.join(saveFolder, `contest-${contestId}`);
  await fs.mkdir(contestFolder, { recursive: true });

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Downloading Contest ${contestId}`,
      cancellable: false,
    },
    async (progress) => {
      try {
        // Fetch problems list
        progress.report({ message: 'Fetching problem list...' });
        const problems = await apiClient.getProblems(contestId);

        if (problems.length === 0) {
          vscode.window.showWarningMessage('No problems found in this contest');
          return;
        }

        // Download each problem
        for (let i = 0; i < problems.length; i++) {
          const problem = problems[i];
          progress.report({
            message: `Downloading problem ${problem.index} (${i + 1}/${problems.length})`,
            increment: (100 / problems.length),
          });

          try {
            const html = await fetchProblemHTML(contestId, problem.index);
            const result = await problemScraper.scrapeProblem(contestId, problem.index, html);

            if (result.success && result.problem) {
              const config = vscode.workspace.getConfiguration('codeforces');
              const markdown = markdownConverter.convert(result.problem, {
                includeExamples: config.get('includeExamples', true),
                includeTags: config.get('includeTags', false),
                includeNotes: config.get('includeNotes', true),
              });

              const filePath = path.join(contestFolder, `${problem.index}.md`);
              await fs.writeFile(filePath, markdown, 'utf-8');
            } else {
              console.error(`Failed to download problem ${problem.index}:`, result.error);
            }
          } catch (error) {
            console.error(`Error downloading problem ${problem.index}:`, error);
          }
        }

        vscode.window.showInformationMessage(
          `Successfully downloaded ${problems.length} problems to ${contestFolder}`
        );

        // Ask to open folder
        const openFolder = await vscode.window.showInformationMessage(
          'Open downloaded folder?',
          'Open',
          'Cancel'
        );

        if (openFolder === 'Open') {
          const uri = vscode.Uri.file(contestFolder);
          await vscode.commands.executeCommand('vscode.openFolder', uri, { forceNewWindow: false });
        }
      } catch (error) {
        vscode.window.showErrorMessage(
          `Failed to download contest: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }
  );
}

/**
 * Download a single problem
 */
async function downloadProblem() {
  // Get contest ID
  const contestIdInput = await vscode.window.showInputBox({
    prompt: 'Enter Contest ID',
    placeHolder: 'e.g., 2000',
    validateInput: (value) => {
      if (!value || !/^\d+$/.test(value)) {
        return 'Please enter a valid contest ID';
      }
      return null;
    },
  });

  if (!contestIdInput) {
    return;
  }

  // Get problem index
  const problemIndex = await vscode.window.showInputBox({
    prompt: 'Enter Problem Index',
    placeHolder: 'e.g., A, B, C',
    validateInput: (value) => {
      if (!value || !/^[A-Za-z]\d*$/.test(value)) {
        return 'Please enter a valid problem index (e.g., A, B, C1)';
      }
      return null;
    },
  });

  if (!problemIndex) {
    return;
  }

  const contestId = parseInt(contestIdInput, 10);
  const index = problemIndex.toUpperCase();

  // Get save location
  const saveFolder = await getSaveFolder();
  if (!saveFolder) {
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Downloading Problem ${index}`,
      cancellable: false,
    },
    async (progress) => {
      try {
        progress.report({ message: 'Fetching problem...' });

        const html = await fetchProblemHTML(contestId, index);
        const result = await problemScraper.scrapeProblem(contestId, index, html);

        if (!result.success || !result.problem) {
          vscode.window.showErrorMessage(`Failed to download problem: ${result.error}`);
          return;
        }

        progress.report({ message: 'Converting to Markdown...' });

        const config = vscode.workspace.getConfiguration('codeforces');
        const markdown = markdownConverter.convert(result.problem, {
          includeExamples: config.get('includeExamples', true),
          includeTags: config.get('includeTags', false),
          includeNotes: config.get('includeNotes', true),
        });

        const filePath = path.join(saveFolder, `${contestId}-${index}.md`);
        await fs.writeFile(filePath, markdown, 'utf-8');

        vscode.window.showInformationMessage(`Problem saved to ${filePath}`);

        // Open the file
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);
      } catch (error) {
        vscode.window.showErrorMessage(
          `Failed to download problem: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }
  );
}

/**
 * Configure API credentials
 */
async function configureAPI() {
  // Show instructions first
  await showAPIInstructions();

  // Prompt for credentials
  const credentials = await promptForCredentials();
  if (!credentials) {
    return;
  }

  // Test credentials
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Testing API credentials...',
      cancellable: false,
    },
    async () => {
      const isValid = await apiClient.testCredentials(credentials);

      if (isValid) {
        // Store credentials securely
        await secureStorage.storeCredentials(credentials);
        apiClient.setCredentials(credentials);

        vscode.window.showInformationMessage('API credentials saved successfully!');
      } else {
        vscode.window.showErrorMessage(
          'Invalid credentials. Please check your API key and secret.'
        );
      }
    }
  );
}

/**
 * Clear stored API credentials
 */
async function clearCredentials() {
  const confirm = await vscode.window.showWarningMessage(
    'Are you sure you want to clear your API credentials?',
    'Yes',
    'No'
  );

  if (confirm === 'Yes') {
    await secureStorage.deleteCredentials();
    apiClient.setCredentials(null);
    vscode.window.showInformationMessage('API credentials cleared');
  }
}

/**
 * Get save folder from user
 */
async function getSaveFolder(): Promise<string | null> {
  const config = vscode.workspace.getConfiguration('codeforces');
  const defaultPath = config.get<string>('downloadPath');

  // Use workspace root if available
  if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
    const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
    return defaultPath ? path.join(workspaceRoot, defaultPath) : workspaceRoot;
  }

  // Otherwise, ask user to select a folder
  const result = await vscode.window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    openLabel: 'Select Save Location',
  });

  return result && result[0] ? result[0].fsPath : null;
}

export function deactivate() {
  console.log('Codeforces Downloader extension deactivated');
}
