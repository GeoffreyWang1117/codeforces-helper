# 📦 Publishing Guide

This guide walks you through publishing to all supported platforms.

## Prerequisites

Before publishing, ensure:

- ✅ All tests pass
- ✅ Code is well-documented
- ✅ CHANGELOG.md is updated
- ✅ Version numbers are bumped
- ✅ README is accurate
- ✅ Security review completed

## 1. VS Code Marketplace

### First-Time Setup

1. **Create Microsoft Account** (if you don't have one)
   - Visit https://aka.ms/vscode-create-publisher

2. **Install vsce**
   ```bash
   npm install -g @vscode/vsce
   ```

3. **Create Publisher**
   - Go to https://marketplace.visualstudio.com/manage
   - Click "Create publisher"
   - Fill in details (ID must match `publisher` in package.json)

4. **Get Personal Access Token**
   - Go to https://dev.azure.com
   - User Settings → Personal Access Tokens
   - New Token with **Marketplace (Manage)** scope
   - Save the token securely!

### Publishing Steps

```bash
cd packages/vscode

# 1. Update version in package.json
# Edit package.json: "version": "1.0.1"

# 2. Build the extension
pnpm build

# 3. Package the extension
pnpm package
# Creates: codeforces-downloader-1.0.1.vsix

# 4. Test the .vsix locally
code --install-extension codeforces-downloader-1.0.1.vsix

# 5. Publish
vsce publish
# Or with token: vsce publish -p <token>
```

### Updating Existing Extension

```bash
# Patch version (1.0.0 -> 1.0.1)
vsce publish patch

# Minor version (1.0.0 -> 1.1.0)
vsce publish minor

# Major version (1.0.0 -> 2.0.0)
vsce publish major
```

## 2. Open VSX (Eclipse Marketplace)

### First-Time Setup

1. **Create Account**
   - Visit https://open-vsx.org/
   - Sign in with GitHub

2. **Get Access Token**
   - Go to https://open-vsx.org/user-settings/tokens
   - Generate new token

3. **Install ovsx**
   ```bash
   npm install -g ovsx
   ```

### Publishing Steps

```bash
cd packages/vscode

# Package (same .vsix as VS Code Marketplace)
pnpm package

# Publish to Open VSX
ovsx publish codeforces-downloader-1.0.1.vsix -p <token>

# Or configure token in .env
echo "OVSX_PAT=your_token" >> .env
ovsx publish
```

## 3. Chrome Web Store

### First-Time Setup

1. **Create Google Developer Account**
   - Visit https://chrome.google.com/webstore/devconsole
   - Pay one-time $5 registration fee

2. **Prepare Assets**
   - Icon: 128x128px
   - Screenshots: 1280x800px (minimum 1, maximum 5)
   - Promotional images (optional)

### Publishing Steps

```bash
cd packages/browser-extension

# 1. Update version in manifest.json
# Edit manifest.json: "version": "1.0.1"

# 2. Build the extension
pnpm build

# 3. Create zip file
cd dist
zip -r ../extension-v1.0.1.zip *
cd ..
```

**Upload to Chrome Web Store:**

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click "New Item"
3. Upload `extension-v1.0.1.zip`
4. Fill in:
   - **Description** (copy from README)
   - **Category**: Developer Tools
   - **Language**: English
   - **Screenshots**: Upload 3-5 screenshots
   - **Privacy practices**: Select "Do not collect or use user data"
5. Set visibility: Public / Unlisted
6. Click "Submit for Review"

**Review Time:** 1-3 business days

### Updating Existing Extension

1. Build and zip new version
2. Go to Developer Dashboard
3. Select your extension
4. Click "Package" → "Upload new package"
5. Upload new zip file
6. Submit for review

## 4. Microsoft Edge Add-ons

Good news! Edge accepts Chrome extensions directly.

### Publishing Steps

1. **Register**
   - Visit https://partner.microsoft.com/en-us/dashboard/microsoftedge/
   - Sign in with Microsoft account (free)

2. **Submit Extension**
   - Click "New Extension"
   - Upload same zip file as Chrome
   - Fill in metadata (can copy from Chrome)
   - Privacy policy: Include link to SECURITY.md
   - Submit

**Review Time:** 1-3 business days

## 5. Brave / Opera Add-ons

### Brave Browser

Brave uses Chrome Web Store directly. No separate submission needed!

Users install from: `brave://extensions`

### Opera Add-ons

1. Visit https://addons.opera.com/developer/
2. Upload same Chrome extension zip
3. Fill in metadata
4. Submit for review

## 6. Obsidian Community Plugins

### First-Time Setup

1. **Fork obsidian-releases**
   ```bash
   git clone https://github.com/obsidianmd/obsidian-releases
   cd obsidian-releases
   ```

2. **Prepare Files**
   ```bash
   cd packages/obsidian
   pnpm build

   # Create release files
   cp manifest.json release/
   cp dist/main.js release/
   ```

### Publishing Steps

1. **Add to community-plugins.json**
   ```bash
   cd obsidian-releases
   # Edit community-plugins.json
   ```

   Add entry:
   ```json
   {
     "id": "codeforces-downloader",
     "name": "Codeforces Downloader",
     "author": "Your Name",
     "description": "Download Codeforces problems as Markdown",
     "repo": "your-username/codeforces-downloader",
     "branch": "main"
   }
   ```

2. **Create Pull Request**
   ```bash
   git checkout -b add-codeforces-downloader
   git add community-plugins.json
   git commit -m "Add Codeforces Downloader plugin"
   git push origin add-codeforces-downloader
   ```

3. **Submit PR**
   - Go to https://github.com/obsidianmd/obsidian-releases
   - Create Pull Request
   - Fill in PR template
   - Wait for community review (1-2 weeks)

### GitHub Release

After PR is merged, create GitHub release:

```bash
# Tag the release
git tag v1.0.0
git push origin v1.0.0

# Create GitHub release
# Go to: https://github.com/your-username/codeforces-downloader/releases
# Click "Create new release"
# Upload: main.js, manifest.json, styles.css
```

## Version Management

### Semantic Versioning

Use [SemVer](https://semver.org/):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features (backward compatible)
- **PATCH** (1.0.0 → 1.0.1): Bug fixes

### Sync Version Numbers

Update version in all `package.json` and `manifest.json` files:

```bash
# Use this helper script
./scripts/bump-version.sh 1.0.1
```

Or manually:
- `packages/vscode/package.json`
- `packages/browser-extension/manifest.json`
- `packages/obsidian/manifest.json`
- `packages/core/package.json`

## Pre-Publishing Checklist

- [ ] Update version numbers
- [ ] Update CHANGELOG.md
- [ ] Run all tests: `pnpm test`
- [ ] Build all packages: `pnpm build`
- [ ] Test each platform locally
- [ ] Update screenshots (if UI changed)
- [ ] Review SECURITY.md
- [ ] Check all links in README
- [ ] Create git tag
- [ ] Push to GitHub

## Post-Publishing Tasks

- [ ] Create GitHub Release with changelog
- [ ] Update documentation site (if any)
- [ ] Announce on social media / forums
- [ ] Monitor for issues
- [ ] Respond to reviews

## Automation (Optional)

Consider setting up GitHub Actions for:

```yaml
# .github/workflows/publish.yml
name: Publish

on:
  release:
    types: [created]

jobs:
  publish-vscode:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Publish to VS Code Marketplace
        run: |
          cd packages/vscode
          npm install
          npx vsce publish -p ${{ secrets.VSCE_TOKEN }}

  publish-browser:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build browser extension
        run: |
          cd packages/browser-extension
          npm install
          npm run build
          cd dist && zip -r ../extension.zip *
      - name: Upload to release
        uses: actions/upload-release-asset@v1
        with:
          upload_url: ${{ github.event.release.upload_url }}
          asset_path: ./packages/browser-extension/extension.zip
          asset_name: browser-extension.zip
          asset_content_type: application/zip
```

## Troubleshooting

### VS Code Marketplace

**Error: "Publisher not found"**
- Make sure `publisher` in package.json matches your marketplace publisher ID

**Error: "Extension validation failed"**
- Run `vsce package` first to see specific errors
- Check that all files are included in `package.json` files

### Chrome Web Store

**Rejected: "Permissions too broad"**
- Review `manifest.json` permissions
- Remove unnecessary permissions
- Justify each permission in description

**Rejected: "Privacy policy required"**
- Link to SECURITY.md or create privacy policy page
- Must be accessible without login

### Obsidian

**PR Not Merged**
- Respond to reviewer comments promptly
- Ensure plugin follows [guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines)
- Test with latest Obsidian version

## Support

Need help publishing?

- 💬 [GitHub Discussions](https://github.com/your-username/codeforces-downloader/discussions)
- 📧 Email: your-email@example.com
- 📚 Read official docs:
  - [VS Code Publishing](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
  - [Chrome Web Store](https://developer.chrome.com/docs/webstore/publish/)
  - [Obsidian Plugins](https://docs.obsidian.md/Plugins/Releasing/Submit+your+plugin)

---

Good luck with your release! 🚀
