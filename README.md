# 🏆 Codeforces Problem Downloader

A privacy-first, multi-platform tool for downloading Codeforces problems as Markdown files.

## 🔒 Privacy & Security First

**YOUR DATA STAYS LOCAL** - This is our core promise:

- ✅ All credentials stored locally on YOUR machine
- ✅ API keys encrypted using OS-level security (Keychain/Credential Manager)
- ✅ Direct connection to codeforces.com - no intermediary servers
- ✅ No telemetry, no analytics, no data collection
- ✅ Open source - you can audit every line of code
- ✅ We (developers) CAN NOT access your credentials

## 🌟 Platforms

This project provides the same functionality across multiple platforms:

### ✅ VS Code Extension
- Command palette integration
- Secure credential storage via VS Code SecretStorage API
- Download contests or individual problems
- Customizable Markdown templates

### ✅ Browser Extension (Chrome, Edge, Brave, Opera)
- Works directly on Codeforces pages
- One-click download button on problem pages
- Popup interface for quick downloads
- Manifest V3 compliant

### 🚧 Obsidian Plugin (Coming Soon)
- Seamless integration with Obsidian vaults
- Perfect for competitive programming notes

## 🚀 Features

- 📥 Download individual problems or entire contests
- 📝 Convert to clean Markdown format
- 🔢 LaTeX formula support
- 📊 Include/exclude examples, tags, and notes
- ⚡ Fast and lightweight
- 🎨 Customizable output templates

## 📦 Installation

### VS Code Extension

```bash
# From source
cd packages/vscode
pnpm install
pnpm build
pnpm package

# Install the generated .vsix file in VS Code
```

Or search for "Codeforces Downloader" in VS Code marketplace (coming soon).

### Browser Extension

```bash
# Build the extension
cd packages/browser-extension
pnpm install
pnpm build

# Load unpacked extension in Chrome:
# 1. Go to chrome://extensions
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the `dist` folder
```

## 💻 Development

This is a monorepo project using pnpm workspaces.

### Prerequisites

- Node.js >= 18
- pnpm >= 8

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/codeforces-downloader
cd codeforces-downloader

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Or build specific packages
pnpm build:vscode
pnpm build:browser

# Development mode (watch)
pnpm dev:vscode
pnpm dev:browser
```

### Project Structure

```
codeforces-downloader/
├── packages/
│   ├── core/              # Shared core functionality
│   │   ├── api/           # Codeforces API client
│   │   ├── scraper/       # HTML parser
│   │   ├── converter/     # Markdown converter
│   │   └── types.ts       # TypeScript types
│   │
│   ├── vscode/            # VS Code extension
│   │   ├── src/
│   │   │   ├── extension.ts
│   │   │   ├── storage.ts  # Secure storage implementation
│   │   │   └── ...
│   │   └── package.json
│   │
│   ├── browser-extension/ # Browser extension
│   │   ├── src/
│   │   │   ├── background.ts
│   │   │   ├── content.ts
│   │   │   └── popup/
│   │   ├── manifest.json
│   │   └── package.json
│   │
│   └── obsidian/          # Obsidian plugin (coming soon)
│
├── python-legacy/         # Original Python implementation
├── docs/                  # Documentation
├── pnpm-workspace.yaml
└── package.json
```

## 🔐 API Credentials (Optional)

Some features require Codeforces API credentials:

1. Go to [codeforces.com/settings/api](https://codeforces.com/settings/api)
2. Generate your API key and secret
3. Enter them in the extension settings

**Security Notes:**
- Credentials are stored locally using platform-provided secure storage
- Never share your credentials
- We cannot access your credentials
- You can clear them anytime

## 📖 Usage

### VS Code

1. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "Codeforces"
3. Choose:
   - `Download Contest` - Download all problems from a contest
   - `Download Problem` - Download a single problem
   - `Configure API` - Set up your API credentials

### Browser Extension

**Method 1: Direct Download Button**
1. Navigate to any Codeforces problem page
2. Click the "📥 Download as Markdown" button

**Method 2: Context Menu**
1. Right-click on a problem page
2. Select "Download Current Problem"

**Method 3: Popup**
1. Click the extension icon
2. Enter contest ID and problem index
3. Click "Download"

## 🎨 Configuration

### VS Code Settings

```json
{
  "codeforces.downloadPath": "",  // Default download location
  "codeforces.includeExamples": true,
  "codeforces.includeTags": false,  // Tags may contain spoilers
  "codeforces.includeNotes": true
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure all security best practices are followed
5. Never compromise user privacy

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- Codeforces for providing the platform and API
- All contributors and users

## 📮 Support

- 🐛 [Report bugs](https://github.com/your-username/codeforces-downloader/issues)
- 💡 [Request features](https://github.com/your-username/codeforces-downloader/issues)
- 📖 [Read docs](https://github.com/your-username/codeforces-downloader/wiki)

## ⚠️ Disclaimer

This is an unofficial tool and is not affiliated with or endorsed by Codeforces. Please use responsibly and respect Codeforces' terms of service.

---

**Made with ❤️ for the competitive programming community**

**Privacy is not optional - it's a fundamental right.**
