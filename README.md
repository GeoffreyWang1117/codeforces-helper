<div align="center">

# 🏆 Codeforces Helper

**Your Privacy-First Companion for Competitive Programming**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0--alpha-blue)](https://github.com/GeoffreyWang1117/codeforces-helper/releases)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Privacy First](https://img.shields.io/badge/Privacy-First-success)](https://github.com/GeoffreyWang1117/codeforces-helper#-privacy--security)

Download Codeforces problems as beautifully formatted Markdown files with **perfect LaTeX formula support** and **automatic test case extraction**.

[Features](#-features) • [Installation](#-quick-start) • [Usage](#-usage) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 🎯 Why Codeforces Helper?

<table>
<tr>
<td width="50%">

### 🔒 **Privacy-First**
- 🔐 All data stays **100% local**
- 🚫 **Zero telemetry**, no tracking
- 🔑 OS-level credential encryption
- ✅ Fully **open source & auditable**

</td>
<td width="50%">

### ⚡ **Feature-Rich**
- 📐 **Perfect LaTeX** formula parsing
- 📦 **PDF problem** support
- 🧪 **Auto test case** extraction
- 🎨 **Markdown** with syntax highlighting

</td>
</tr>
</table>

---

## ✨ Features

### 🎯 Core Capabilities

- **📥 Smart Download** - Single problems, entire contests, or PDF-only problems
- **🔢 Perfect Math Rendering** - Supports all 7 Codeforces LaTeX formats with 100% accuracy
- **🧪 Test Case Extraction** - Automatically saves examples as `in*.txt` and `out*.txt` files
- **🤖 Auto Test Scripts** - Generates ready-to-use test runner scripts (Bash/Python/Node.js)
- **📊 Rich Metadata** - Includes time limits, memory limits, ratings, and tags
- **⚙️ Highly Configurable** - Customize output format, paths, and content options

### 🛠️ Advanced Features

| Feature | Description | Status |
|---------|-------------|--------|
| **Formula Parser** | Handles `$...$`, `$$...$$`, `\(...\)`, `\[...\]`, and Codeforces-specific formats | ✅ |
| **PDF Detection** | Auto-detects and downloads PDF-only problems | ✅ |
| **Test Validation** | Validates test cases for parsing errors | ✅ |
| **Batch Testing** | Framework to validate 100+ contests | ✅ |
| **API Integration** | Optional Codeforces API for enhanced features | ✅ |
| **Auto-Updates** | Smart update notifications | 🚧 |

---

## 🚀 Quick Start

### For VS Code Users

1. **Install from Marketplace** (coming soon) or **Build from Source**:

   ```bash
   git clone https://github.com/GeoffreyWang1117/codeforces-helper.git
   cd codeforces-helper
   pnpm install
   pnpm build:vscode
   pnpm --filter codeforces-downloader package
   ```

2. **Install the Extension**:
   - Open VS Code
   - Press `Ctrl+Shift+X` (Extensions)
   - Click `...` → Install from VSIX
   - Select `codeforces-downloader-1.0.0.vsix`

3. **Start Using**:
   - Press `Ctrl+Shift+C` (or click the Codeforces icon in status bar)
   - Choose "Download Single Problem"
   - Enter contest ID (e.g., `2000`) and problem index (e.g., `A`)
   - Done! 🎉

---

## 📖 Usage

### 1️⃣ **Basic Download**

**Method 1: Status Bar** (Recommended)
```
Click "Codeforces" icon in bottom-right corner → Choose action
```

**Method 2: Keyboard Shortcut**
```
Ctrl+Shift+C (Windows/Linux)
Cmd+Shift+C (macOS)
```

**Method 3: Command Palette**
```
Ctrl+Shift+P → Type "Codeforces" → Select command
```

### 2️⃣ **Download a Problem**

<table>
<tr>
<td width="50%">

**Input:**
```
Contest ID: 2000
Problem Index: A
```

</td>
<td width="50%">

**Output:**
```
📁 workspace/
  ├── 2000-A.md          # Problem statement
  └── 2000-A-tests/      # Test cases
      ├── in1.txt
      ├── out1.txt
      ├── in2.txt
      ├── out2.txt
      ├── test.sh        # Test runner
      └── README.md      # Metadata
```

</td>
</tr>
</table>

### 3️⃣ **Download Entire Contest**

```
Contest ID: 2000
→ Downloads all problems (A, B, C, D, ...)
→ Saves to contest-2000/ folder
```

### 4️⃣ **Using Test Cases**

Once downloaded, test your solution instantly:

```bash
# Compile your solution
g++ solution.cpp -o solution

# Run tests
cd 2000-A-tests/
chmod +x test.sh
./test.sh ../solution

# Output:
# ✓ Test case 1: PASSED
# ✓ Test case 2: PASSED
# Results: 2 passed, 0 failed
```

---

## 🔐 Privacy & Security

<div align="center">

### **🛡️ We Take Your Privacy Seriously**

</div>

| What We Do | What We Don't Do |
|------------|------------------|
| ✅ Store credentials **locally** (OS keychain) | ❌ Send data to external servers |
| ✅ Connect **directly** to Codeforces API | ❌ Use intermediary services |
| ✅ Provide **open source** code for audit | ❌ Collect telemetry or analytics |
| ✅ Encrypt sensitive data with **OS-level** security | ❌ Track your usage patterns |
| ✅ Give you **full control** over your data | ❌ Access your credentials (impossible) |

**Credential Storage Locations:**
- 🪟 **Windows**: Windows Credential Manager
- 🍎 **macOS**: Keychain
- 🐧 **Linux**: Secret Service API (libsecret)

---

## ⚙️ Configuration

### VS Code Settings

```jsonc
{
  // Download location (relative to workspace root)
  "codeforces.downloadPath": "",

  // Include test case examples
  "codeforces.includeExamples": true,

  // Save test cases as separate files
  "codeforces.saveTestCases": true,

  // Include problem tags (may contain spoilers!)
  "codeforces.includeTags": false,

  // Include problem notes section
  "codeforces.includeNotes": true
}
```

### API Credentials (Optional)

For enhanced features, configure your Codeforces API credentials:

1. Visit [codeforces.com/settings/api](https://codeforces.com/settings/api)
2. Copy your **API Key** and **API Secret**
3. In VS Code:
   - Click Codeforces icon → "Configure API Credentials"
   - Paste your credentials
   - ✅ Done! (Stored securely in OS keychain)

---

## 📦 Project Structure

```
codeforces-helper/
├── packages/
│   ├── core/                    # 🧩 Core library
│   │   ├── src/
│   │   │   ├── api/            # Codeforces API client
│   │   │   ├── scraper/        # HTML parser
│   │   │   ├── converter/      # Markdown & LaTeX converter
│   │   │   ├── downloader/     # PDF & test case handlers
│   │   │   └── types.ts        # TypeScript definitions
│   │   └── dist/               # Build output (35.3kb)
│   │
│   ├── vscode/                  # 🎨 VS Code Extension
│   │   ├── src/
│   │   │   ├── extension.ts    # Main extension logic
│   │   │   ├── storage.ts      # Secure credential storage
│   │   │   └── parser-adapter.ts
│   │   ├── resources/          # Icons and assets
│   │   ├── dist/               # Build output (461.8kb)
│   │   ├── USER_GUIDE.md       # Detailed Chinese guide
│   │   ├── QUICKSTART.md       # 5-minute quick start
│   │   └── package.json
│   │
│   ├── browser-extension/       # 🌐 Browser Extension (planned)
│   └── obsidian/                # 📓 Obsidian Plugin (planned)
│
├── tests/
│   └── batch-test.ts           # 100-contest validation framework
│
├── docs/                        # 📚 Documentation
├── PRODUCT_ROADMAP.md          # Product planning
├── ALPHA_PRODUCT_STATUS.md     # Development progress (75%)
└── README.md                    # You are here!
```

---

## 🏗️ Development

### Prerequisites

- **Node.js** ≥ 20.0.0
- **pnpm** ≥ 8.0.0

### Setup

```bash
# 1. Clone repository
git clone https://github.com/GeoffreyWang1117/codeforces-helper.git
cd codeforces-helper

# 2. Install dependencies
pnpm install

# 3. Build all packages
pnpm build

# 4. Build specific packages
pnpm build:core      # Core library
pnpm build:vscode    # VS Code extension

# 5. Development mode (watch)
pnpm dev:vscode
```

### Testing

```bash
# Unit tests
pnpm test

# Batch validation (requires Codeforces access)
cd tests
node batch-test.ts
```

---

## 🗺️ Roadmap

### ✅ Alpha 1.0.0 (Current - 75% Complete)

- [x] Enhanced LaTeX formula parser (100% accuracy)
- [x] PDF problem support
- [x] Test case extraction
- [x] VS Code extension with full UI
- [x] Batch testing framework
- [ ] Run 100-contest validation
- [ ] Fix issues and optimize
- [ ] Release to marketplace

### 🚧 Beta 1.0.0 (Planned)

- [ ] Browser automation (Puppeteer/Playwright)
- [ ] User login support
- [ ] Code submission from VS Code
- [ ] Solution template generation
- [ ] Verdict checking and auto-retry

### 🔮 Future (v2.0+)

- [ ] Browser extension (Chrome, Edge, Firefox)
- [ ] Obsidian plugin
- [ ] CLI tool
- [ ] Contest participation mode
- [ ] Problem recommendation based on rating
- [ ] Virtual contest support

See [PRODUCT_ROADMAP.md](./PRODUCT_ROADMAP.md) for detailed planning.

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute

- 🐛 **Report Bugs**: [Create an issue](https://github.com/GeoffreyWang1117/codeforces-helper/issues/new?template=bug_report.md)
- 💡 **Suggest Features**: [Request a feature](https://github.com/GeoffreyWang1117/codeforces-helper/issues/new?template=feature_request.md)
- 📝 **Improve Docs**: Help make our documentation better
- 🔧 **Submit PRs**: Fix bugs or add new features
- 🌍 **Translate**: Add support for more languages

### Development Guidelines

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

Please follow our code style and include tests for new features.

---

## 📚 Documentation

- 📘 [User Guide (中文)](./packages/vscode/USER_GUIDE.md) - Comprehensive usage guide
- 📗 [Quick Start (中文)](./packages/vscode/QUICKSTART.md) - 5-minute tutorial
- 📙 [Product Roadmap](./PRODUCT_ROADMAP.md) - Feature planning
- 📕 [Alpha Status](./ALPHA_PRODUCT_STATUS.md) - Development progress
- 📓 [Publishing Guide](./packages/vscode/PUBLISH.md) - How to publish

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What This Means

✅ **You can:**
- Use this software for any purpose
- Modify and distribute it
- Use it commercially

❌ **You cannot:**
- Hold us liable for any issues
- Use our name to promote derivatives without permission

---

## 🙏 Acknowledgments

- **Codeforces** - For providing an amazing competitive programming platform
- **Mike Mirzayanov** - For creating and maintaining Codeforces
- **All Contributors** - Thank you for your contributions!
- **Open Source Community** - For the amazing tools and libraries we use

---

## 📮 Support & Contact

### Get Help

- 📖 [Read the Documentation](./packages/vscode/USER_GUIDE.md)
- 🐛 [Report a Bug](https://github.com/GeoffreyWang1117/codeforces-helper/issues)
- 💬 [Ask a Question](https://github.com/GeoffreyWang1117/codeforces-helper/discussions)
- 📧 [Email Us](mailto:geoffreywang1117@gmail.com)

### Stay Updated

- ⭐ **Star this repo** to show your support
- 👁️ **Watch** for updates and new releases
- 🔔 **Follow** for announcements

---

## ⚠️ Disclaimer

This is an **unofficial tool** and is **not affiliated with or endorsed by Codeforces**.

Please use this tool responsibly and respect:
- Codeforces' [Terms of Service](https://codeforces.com/blog/entry/967)
- Rate limiting guidelines
- Community guidelines

We are not responsible for any misuse of this tool.

---

<div align="center">

### **Made with ❤️ for the Competitive Programming Community**

**Privacy is not optional - it's a fundamental right.**

[⬆ Back to Top](#-codeforces-helper)

</div>
