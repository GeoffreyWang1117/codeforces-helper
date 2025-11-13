# Change Log

All notable changes to the "Codeforces Problem Downloader" extension will be documented in this file.

## [1.0.0] - 2025-11-12

### Added
- Initial release
- Download individual Codeforces problems as Markdown
- Download entire contests at once
- Secure API credential storage using VS Code SecretStorage API
- Customizable download options:
  - Include/exclude example test cases
  - Include/exclude problem tags
  - Include/exclude notes section
- Support for LaTeX formulas in problem statements
- Direct integration with VS Code Command Palette
- Privacy-first design: all data stays local, no telemetry

### Features
- Command: `Codeforces: Download Single Problem`
- Command: `Codeforces: Download Contest`
- Command: `Codeforces: Configure API Credentials`
- Command: `Codeforces: Clear API Credentials`
- Configuration: `codeforces.downloadPath`
- Configuration: `codeforces.includeExamples`
- Configuration: `codeforces.includeTags`
- Configuration: `codeforces.includeNotes`

## [Unreleased]

### Planned
- Batch download by problem rating
- Download user's practice history
- Custom Markdown templates
- Multi-language support
- Problem difficulty indicators
- Search problems by tags
