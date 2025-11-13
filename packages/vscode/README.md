# Codeforces Problem Downloader for VS Code

[![Privacy First](https://img.shields.io/badge/Privacy-First-blue)](https://github.com/your-username/codeforces-downloader#privacy)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Download Codeforces problems as clean Markdown files directly within VS Code.

## 🔒 Privacy First

**YOUR DATA STAYS LOCAL** - This is our core promise:

- ✅ All credentials stored locally on YOUR machine
- ✅ API keys encrypted using VS Code SecretStorage API (OS-level keychain)
- ✅ Direct connection to codeforces.com - no intermediary servers
- ✅ No telemetry, no analytics, no data collection
- ✅ Open source - you can audit every line of code
- ✅ We (developers) CAN NOT access your credentials

## ✨ Features

- 📥 **Download Individual Problems** - Save any Codeforces problem as Markdown
- 📦 **Download Entire Contests** - Get all problems from a contest at once
- 📝 **Clean Markdown Format** - Properly formatted with LaTeX formulas
- 🔢 **Example Test Cases** - Include sample inputs/outputs
- 🏷️ **Tags & Notes** - Optional problem tags and editorial notes
- ⚡ **Fast & Lightweight** - No heavy dependencies
- 🎨 **Customizable** - Configure download location and output format

## 📥 Installation

1. Open VS Code
2. Press `Ctrl+P` (or `Cmd+P` on Mac)
3. Type: `ext install codeforces-dl.codeforces-downloader`
4. Press Enter

Or search for "Codeforces Problem Downloader" in the Extensions marketplace.

## 🚀 Quick Start

### Download a Single Problem

1. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type: `Codeforces: Download Single Problem`
3. Enter the Contest ID (e.g., `2000`)
4. Enter the Problem Index (e.g., `A`, `B`, `C`)
5. The problem will be saved as a Markdown file in your workspace

### Download an Entire Contest

1. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type: `Codeforces: Download Contest`
3. Enter the Contest ID (e.g., `2000`)
4. All problems will be downloaded to a `contest-{ID}` folder

## ⚙️ Configuration

Open VS Code Settings (`Ctrl+,` or `Cmd+,`) and search for "Codeforces":

```json
{
  // Default download location (relative to workspace root)
  "codeforces.downloadPath": "",

  // Include example test cases
  "codeforces.includeExamples": true,

  // Include problem tags (may contain spoilers!)
  "codeforces.includeTags": false,

  // Include notes section
  "codeforces.includeNotes": true
}
```

## 🔐 API Credentials (Optional)

Some features require Codeforces API credentials:

1. Go to [codeforces.com/settings/api](https://codeforces.com/settings/api)
2. Generate your API key and secret
3. Open Command Palette and run: `Codeforces: Configure API Credentials`
4. Enter your key and secret

**Security Notes:**
- Credentials are stored in OS keychain (Windows Credential Manager, macOS Keychain, Linux Secret Service)
- Never share your credentials with anyone
- You can clear them anytime with: `Codeforces: Clear API Credentials`

## 📖 Example Output

Downloaded problems are formatted as clean Markdown with:

```markdown
# A. Problem Title

**Time Limit:** 1 second
**Memory Limit:** 256 megabytes

## Problem Statement

[Problem description with LaTeX formulas]

## Input

[Input format]

## Output

[Output format]

## Examples

### Example 1

**Input:**
\`\`\`
[sample input]
\`\`\`

**Output:**
\`\`\`
[sample output]
\`\`\`

## Notes

[Additional notes and hints]
```

## 🤝 Contributing

Found a bug or have a feature request? Please [open an issue](https://github.com/your-username/codeforces-downloader/issues)!

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## ⚠️ Disclaimer

This is an unofficial tool and is not affiliated with or endorsed by Codeforces.

---

**Made with ❤️ for the competitive programming community**

**Privacy is not optional - it's a fundamental right.**
