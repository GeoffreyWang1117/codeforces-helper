# Publishing Guide

This guide explains how to publish the Codeforces Downloader extension to the VS Code Marketplace and Open VSX.

## Prerequisites

1. **VS Code Marketplace (Microsoft)**
   - Create a publisher account at https://marketplace.visualstudio.com/manage
   - Generate a Personal Access Token (PAT) from Azure DevOps
   - Login: `vsce login <publisher-name>`

2. **Open VSX Registry**
   - Create an account at https://open-vsx.org/
   - Generate an access token
   - Login: `ovsx login <access-token>`

## Publishing Steps

### 1. Update Version

Update the version in `package.json`:
```bash
# For a patch release (1.0.0 -> 1.0.1)
npm version patch

# For a minor release (1.0.0 -> 1.1.0)
npm version minor

# For a major release (1.0.0 -> 2.0.0)
npm version major
```

### 2. Update CHANGELOG.md

Document all changes in `CHANGELOG.md`.

### 3. Build the Extension

```bash
# Make sure you're in the vscode package directory
cd packages/vscode

# Install dependencies
pnpm install

# Build the extension
pnpm build

# Package the extension
pnpm package
```

This will create a `.vsix` file in the current directory.

### 4. Test the Package Locally

```bash
# Install the .vsix file in VS Code
code --install-extension codeforces-downloader-1.0.0.vsix
```

Test all features to ensure everything works correctly.

### 5. Publish to VS Code Marketplace

```bash
# Login (first time only)
vsce login codeforces-dl

# Publish
pnpm publish

# Or publish a specific .vsix file
vsce publish --packagePath codeforces-downloader-1.0.0.vsix
```

### 6. Publish to Open VSX

```bash
# Login (first time only)
ovsx login <your-access-token>

# Publish
pnpm publish:ovsx

# Or publish a specific .vsix file
ovsx publish codeforces-downloader-1.0.0.vsix
```

## Publishing Checklist

Before publishing, make sure:

- [ ] All features are working correctly
- [ ] Version number is updated in `package.json`
- [ ] `CHANGELOG.md` is updated
- [ ] README.md is up-to-date
- [ ] No sensitive information in the code
- [ ] All dependencies are properly listed
- [ ] Extension has been tested locally
- [ ] Icon and gallery banner are set
- [ ] Repository URL is correct
- [ ] License file exists

## Common Issues

### Issue: "Publisher not found"
**Solution:** Make sure you've created a publisher account and logged in using `vsce login`.

### Issue: "Package validation failed"
**Solution:** Check that all required fields in `package.json` are filled, especially `publisher`, `repository`, and `icon`.

### Issue: ".vsix file too large"
**Solution:** Check `.vscodeignore` to ensure unnecessary files are excluded.

## After Publishing

1. Verify the extension appears on the marketplace
2. Test installation from the marketplace
3. Monitor user feedback and issues
4. Plan the next release

## Useful Commands

```bash
# Show package contents without publishing
vsce ls

# Show package info
vsce show <publisher>.<extension-name>

# Unpublish a version (use with caution!)
vsce unpublish <publisher>.<extension-name>@<version>
```

## Resources

- [VS Code Publishing Guide](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Open VSX Publishing](https://github.com/eclipse/openvsx/wiki/Publishing-Extensions)
- [Extension Manifest Reference](https://code.visualstudio.com/api/references/extension-manifest)
