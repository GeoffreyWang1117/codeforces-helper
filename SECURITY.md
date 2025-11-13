# 🔒 Security & Privacy Policy

## Our Commitment

**Your privacy and security are our top priorities.** This document explains exactly how we handle your data and protect your credentials.

## Privacy Guarantees

### What We DON'T Do

❌ **No Data Collection** - We don't collect any user data
❌ **No Analytics** - No Google Analytics, no tracking pixels
❌ **No Telemetry** - No usage statistics sent anywhere
❌ **No Cloud Storage** - Your data never touches our servers
❌ **No Third-Party Services** - Only direct connection to Codeforces
❌ **No Credential Access** - Developers CANNOT access your API keys

### What We DO

✅ **Local Storage Only** - Everything stays on your machine
✅ **OS-Level Encryption** - Credentials protected by your OS keychain
✅ **Open Source** - Full code transparency for audit
✅ **Direct API Calls** - All requests go straight to codeforces.com
✅ **Minimal Permissions** - Only essential browser/editor permissions

## How Credentials Are Stored

### VS Code Extension

```
User API Credentials
        ↓
VS Code SecretStorage API
        ↓
Operating System Keychain
        ↓
┌─────────────────────────┐
│  macOS: Keychain Access │
│  Windows: Credential Mgr│
│  Linux: Secret Service  │
└─────────────────────────┘
        ↓
    Encrypted
```

**Security Features:**
- Uses VS Code's official `SecretStorage` API
- Encrypted by operating system
- Separate from regular extension storage
- Cannot be accessed by other extensions
- Cleared when you uninstall the extension

### Browser Extension

```
User API Credentials
        ↓
chrome.storage.local API
        ↓
Browser Encrypted Storage
        ↓
    User's Profile
```

**Security Features:**
- Uses browser's encrypted storage API
- Isolated from websites and other extensions
- Synced across devices (if browser sync enabled)
- Cleared when extension data is cleared
- Protected by browser's security model

### Obsidian Plugin

```
User API Credentials
        ↓
Plugin Data Storage
        ↓
Obsidian Vault Folder
        ↓
User's File System
```

**Security Features:**
- Stored in plugin's data.json
- Located in user's vault folder
- Protected by file system permissions
- Users can back up or encrypt vault

## API Communication Flow

```
Extension/Plugin
      ↓
  (Your API Key + Secret - LOCAL ONLY)
      ↓
Generate Signature (LOCAL)
      ↓
HTTPS Request → codeforces.com
      ↓
Response ← codeforces.com
      ↓
Parse & Display (LOCAL)
```

**No intermediary servers. Ever.**

## Code Transparency

### How to Verify Security

1. **Check the Source Code**
   ```bash
   git clone https://github.com/your-username/codeforces-downloader
   cd codeforces-downloader
   # Read the code - it's all there
   ```

2. **VS Code Extension**
   - File: `packages/vscode/src/storage.ts`
   - Look for `VSCodeSecureStorage` class
   - Uses only `context.secrets` API

3. **Browser Extension**
   - File: `packages/browser-extension/src/background.ts`
   - Look for `storeCredentials()` function
   - Uses only `chrome.storage.local` API

4. **Core Module**
   - File: `packages/core/src/api/client.ts`
   - All network requests visible
   - No hidden endpoints

## Permissions Explained

### VS Code Extension

```json
{
  "No special permissions required": "All operations use standard VS Code APIs"
}
```

### Browser Extension

| Permission | Why We Need It | What We DON'T Do |
|------------|----------------|------------------|
| `storage` | Store API credentials locally | ❌ No cloud sync |
| `downloads` | Save Markdown files | ❌ No file inspection |
| `contextMenus` | Add right-click menu | ❌ No menu hijacking |
| `https://codeforces.com/*` | Fetch problem pages | ❌ No other websites |

## Security Best Practices for Users

### Protecting Your API Credentials

1. **Get Credentials Safely**
   - Only from official Codeforces: https://codeforces.com/settings/api
   - Never from third parties

2. **Store Safely**
   - Use the extension's secure storage
   - Don't save in plain text files
   - Don't share screenshots with credentials

3. **Verify the Extension**
   - Download from official sources only
   - Check the publisher name
   - Review permissions before installing

4. **Revoke if Needed**
   - Go to Codeforces API settings
   - Generate new credentials if suspicious activity

### What to Do If Compromised

If you believe your API credentials were compromised:

1. **Immediately revoke** old credentials on Codeforces
2. **Generate new** API key and secret
3. **Clear stored credentials** in the extension
4. **Report the incident** to us via GitHub Issues

## Data Retention

| Data Type | Where Stored | When Deleted |
|-----------|--------------|--------------|
| API Credentials | OS Keychain / Browser Storage | When you clear credentials or uninstall |
| Downloaded Files | Your chosen location | Never (you control them) |
| Extension Settings | Local storage | When you uninstall |

**We retain: NOTHING** - All data is on your machine.

## Third-Party Dependencies

We use minimal, well-audited dependencies:

### Runtime Dependencies
- **linkedom** - Lightweight DOM parser (VS Code)
- **@cf-dl/core** - Our own core module

### Build Dependencies
- **esbuild** - Fast bundler
- **typescript** - Type safety

All dependencies are:
- Open source
- Regularly updated
- Security-audited by the community
- Listed in `package.json` files

## Vulnerability Reporting

Found a security issue? Please report responsibly:

### DO:
✅ Email: security@your-email.com
✅ GitHub Security Advisories: [Private Report](https://github.com/your-username/codeforces-downloader/security/advisories/new)
✅ Allow us 90 days to fix before public disclosure

### DON'T:
❌ Post publicly on GitHub Issues
❌ Tweet or blog about it before we fix
❌ Test on production Codeforces infrastructure

## Security Updates

We monitor and respond to security issues:

- Security patches released ASAP
- Users notified via GitHub Releases
- Automatic updates in VS Code and browsers
- Clear upgrade instructions provided

## Compliance

This project aims to comply with:

- ✅ GDPR (No data collection = no issues)
- ✅ CCPA (No California data = no issues)
- ✅ Browser extension store policies
- ✅ VS Code Marketplace policies

## Questions?

Security questions? Contact us:

- 📧 Email: security@your-email.com
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/codeforces-downloader/discussions)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/codeforces-downloader/issues)

---

**Last Updated:** 2025-11-12

**Remember:** If it seems too good to be true, verify the code yourself. We encourage it!
