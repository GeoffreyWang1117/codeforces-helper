# Codeforces Downloader - 用户指南

## 📖 目录

- [快速开始](#快速开始)
- [安装扩展](#安装扩展)
- [首次使用](#首次使用)
- [如何调用插件](#如何调用插件)
- [配置 API 密钥](#配置-api-密钥)
- [下载题目](#下载题目)
- [常见问题](#常见问题)
- [快捷键](#快捷键)
- [故障排除](#故障排除)

---

## 🚀 快速开始

### 三种使用方式

1. **状态栏按钮**（最简单）
   - 查看 VSCode 窗口右下角
   - 点击 `$(cloud-download) Codeforces` 图标

2. **命令面板**（推荐）
   - 按 `Ctrl+Shift+P`（Mac: `Cmd+Shift+P`）
   - 输入 "Codeforces"

3. **快捷键**
   - 按 `Ctrl+Shift+C`（Mac: `Cmd+Shift+C`）
   - 直接打开快捷菜单

---

## 📦 安装扩展

### 方法 1: 从 VSIX 文件安装（当前版本）

1. **下载 VSIX 文件**
   ```bash
   # 文件位置
   packages/vscode/codeforces-downloader-1.0.0.vsix
   ```

2. **安装到 VSCode**

   **选项 A: 通过命令行**
   ```bash
   code --install-extension codeforces-downloader-1.0.0.vsix
   ```

   **选项 B: 通过 VSCode 界面**
   - 打开 VSCode
   - 按 `Ctrl+Shift+P` 打开命令面板
   - 输入 "Extensions: Install from VSIX..."
   - 选择 `codeforces-downloader-1.0.0.vsix` 文件
   - 点击安装

3. **重新加载 VSCode**
   - VSCode 会提示重新加载
   - 点击 "Reload" 或重启 VSCode

### 方法 2: 从 VS Code Marketplace 安装（即将推出）

1. 打开 VSCode
2. 点击左侧扩展图标（或按 `Ctrl+Shift+X`）
3. 搜索 "Codeforces Downloader"
4. 点击 "Install"

---

## 🎬 首次使用

### 欢迎向导

安装后首次启动，你会看到欢迎消息：

```
🎉 Welcome to Codeforces Downloader!
Would you like a quick tour?

[Yes, show me!]  [Maybe later]
```

**建议选择 "Yes, show me!"** 查看快速教程。

### 快速教程步骤

#### Step 1: 找到状态栏图标
```
📥 Step 1: Click the Codeforces icon in the status bar (bottom right)

[Got it!]
```

- **位置**：VSCode 窗口右下角
- **图标**：`$(cloud-download) Codeforces`
- **点击**：打开快捷菜单

#### Step 2: 使用命令面板
```
⌨️ Step 2: Or use Command Palette (Ctrl/Cmd+Shift+P) and type "Codeforces"

[Next]
```

- **快捷键**：`Ctrl+Shift+P`（Mac: `Cmd+Shift+P`）
- **输入**："Codeforces"
- **选择**：任意 Codeforces 命令

#### Step 3: 配置 API（可选）
```
🔑 Step 3 (Optional): Configure API credentials for faster downloads

Command: "Codeforces: Configure API Credentials"

[Configure now]  [Skip (can configure later)]
```

- **可选**：API 不是必需的，但推荐配置
- **用途**：加快下载速度，访问更多功能
- **稍后配置**：随时可以配置

---

## 🎯 如何调用插件

### 方法 1: 状态栏按钮（最简单）

![Status Bar](https://via.placeholder.com/600x60/1E3A8A/FFFFFF?text=Status+Bar:+Codeforces+Icon)

**步骤**：
1. 查看 VSCode 窗口 **右下角**
2. 找到 `$(cloud-download) Codeforces` 图标
3. **点击**图标
4. 选择你想要的操作

**显示内容**：
```
┌─────────────────────────────────────────────┐
│ What would you like to do?                  │
├─────────────────────────────────────────────┤
│ $(cloud-download) Download Single Problem   │
│ Download one problem by Contest ID and ...  │
│                                              │
│ $(folder) Download Entire Contest           │
│ Download all problems from a contest        │
│                                              │
│ $(key) Configure API Credentials            │
│ Setup API key for faster downloads ...      │
│                                              │
│ $(question) Help & Documentation            │
│ Learn how to use this extension             │
└─────────────────────────────────────────────┘
```

---

### 方法 2: 命令面板（推荐）

![Command Palette](https://via.placeholder.com/600x400/1E3A8A/FFFFFF?text=Command+Palette)

**步骤**：
1. 按 `Ctrl+Shift+P`（Mac: `Cmd+Shift+P`）
2. 输入 "**Codeforces**"
3. 选择命令

**可用命令**：
```
> Codeforces: Open Menu
> Codeforces: Download Single Problem
> Codeforces: Download Contest
> Codeforces: Configure API Credentials
> Codeforces: Clear API Credentials
> Codeforces: Help & Documentation
```

---

### 方法 3: 快捷键（最快）

**快捷键**：`Ctrl+Shift+C`（Mac: `Cmd+Shift+C`）

**效果**：直接打开快捷菜单

**自定义快捷键**：
1. 打开键盘快捷方式：`Ctrl+K Ctrl+S`
2. 搜索 "codeforces.showMenu"
3. 设置你喜欢的快捷键

---

## 🔑 配置 API 密钥

### 为什么需要 API 密钥？

**API 密钥是可选的**，但推荐配置：

✅ **有 API 密钥**：
- 下载速度更快
- 可以访问用户数据
- 可以获取完整比赛信息

⚠️ **没有 API 密钥**：
- 仍然可以下载题目
- 只能使用公开数据
- 可能会受到限流

---

### 如何获取 API 密钥

#### 步骤 1: 登录 Codeforces

1. 访问 [codeforces.com](https://codeforces.com)
2. 登录你的账号
3. 如果没有账号，先[注册](https://codeforces.com/register)

#### 步骤 2: 进入 API 设置页面

1. 登录后，点击右上角你的用户名
2. 选择 "**Settings**"
3. 在左侧菜单选择 "**API**"
4. 或直接访问：[codeforces.com/settings/api](https://codeforces.com/settings/api)

#### 步骤 3: 生成 API Key 和 Secret

![API Settings Page](https://via.placeholder.com/600x400/1E3A8A/FFFFFF?text=Codeforces+API+Settings)

页面显示：
```
API Key and Secret

Key:    [显示你的 API Key]
Secret: [显示你的 API Secret]

[Generate New Key/Secret Pair]
```

**重要**：
- **复制** API Key（一串字母数字）
- **复制** API Secret（一串字母数字）
- **保密**：不要分享给其他人

---

### 在扩展中配置 API

#### 方法 1: 通过快捷菜单

1. 点击状态栏 `Codeforces` 图标
2. 选择 "**Configure API Credentials**"
3. 按提示操作

#### 方法 2: 通过命令面板

1. 按 `Ctrl+Shift+P`
2. 输入 "**Codeforces: Configure API Credentials**"
3. 按 `Enter`

#### 配置步骤

**Step 1: 查看说明**
```
┌─────────────────────────────────────────────┐
│ How to get Codeforces API Credentials       │
├─────────────────────────────────────────────┤
│                                              │
│ 1. Visit: https://codeforces.com/settings/api│
│ 2. Login to your Codeforces account         │
│ 3. Copy your API Key and Secret             │
│                                              │
│ Your credentials will be stored securely    │
│ in your system's keychain (OS-level).       │
│                                              │
│ [Open API Page]  [I have my credentials]    │
└─────────────────────────────────────────────┘
```

**Step 2: 输入 API Key**
```
┌─────────────────────────────────────────────┐
│ Enter your Codeforces API Key               │
├─────────────────────────────────────────────┤
│ [abc123def456...                          ] │
│                                              │
│ The key is a string of letters and numbers  │
└─────────────────────────────────────────────┘
```

**Step 3: 输入 API Secret**
```
┌─────────────────────────────────────────────┐
│ Enter your Codeforces API Secret            │
├─────────────────────────────────────────────┤
│ [xyz789uvw012...                          ] │
│                                              │
│ The secret is a string of letters and numbers│
└─────────────────────────────────────────────┘
```

**Step 4: 验证**
```
Testing API credentials...

✅ API credentials saved successfully!

Your credentials are stored securely in:
- Windows: Windows Credential Manager
- macOS: Keychain
- Linux: Secret Service API
```

---

### API 密钥存储位置

**安全存储**：
- ✅ **Windows**: Windows Credential Manager
- ✅ **macOS**: Keychain
- ✅ **Linux**: Secret Service API（libsecret）

**隐私保证**：
- ✅ 本地存储，不上传
- ✅ 操作系统级加密
- ✅ 只有你能访问
- ✅ 开发者无法获取

---

### 更新或清除 API 密钥

#### 更新 API 密钥

1. 点击状态栏图标
2. 选择 "**Update API Credentials**"
3. 输入新的密钥

#### 清除 API 密钥

1. 点击状态栏图标
2. 选择 "**Clear API Credentials**"
3. 确认删除

```
⚠️ Are you sure you want to clear your API credentials?

[Yes]  [No]
```

---

## 📥 下载题目

### 下载单个题目

#### 步骤

1. **打开菜单**
   - 点击状态栏 `Codeforces` 图标
   - 或按 `Ctrl+Shift+C`

2. **选择 "Download Single Problem"**

3. **输入 Contest ID**
   ```
   Enter Contest ID
   e.g., 2000
   [2000              ]
   ```

   示例：
   - `2000` - Codeforces Round #2000
   - `1999` - Codeforces Round #1999
   - `1900` - Educational Codeforces Round

4. **输入 Problem Index**
   ```
   Enter Problem Index
   e.g., A, B, C
   [A                 ]
   ```

   示例：
   - `A` - 第一题
   - `B` - 第二题
   - `C1` - 第三题第一部分

5. **等待下载**
   ```
   Downloading Problem A

   ✓ Fetching problem...
   ✓ Converting to Markdown...
   ✓ Saving file...

   Problem saved to: /path/to/2000-A.md
   ```

6. **查看结果**
   - 文件自动打开
   - 保存位置：工作区根目录（或配置的路径）

---

### 下载整场比赛

#### 步骤

1. **打开菜单**
   - 点击状态栏图标
   - 选择 "**Download Entire Contest**"

2. **输入 Contest ID**
   ```
   Enter Contest ID
   e.g., 2000
   [2000              ]
   ```

3. **等待下载**
   ```
   Downloading Contest 2000

   ✓ Fetching problem list... (7 problems found)
   ✓ Downloading problem A (1/7)
   ✓ Downloading problem B (2/7)
   ✓ Downloading problem C (3/7)
   ...

   Successfully downloaded 7 problems to:
   /path/to/contest-2000/
   ```

4. **查看结果**
   ```
   contest-2000/
   ├── A.md
   ├── B.md
   ├── C.md
   ├── D.md
   ├── E.md
   ├── F.md
   └── G.md
   ```

5. **打开文件夹**（可选）
   ```
   Open downloaded folder?

   [Open]  [Cancel]
   ```

---

### 下载后的文件格式

#### Markdown 文件示例

```markdown
# A. Problem Title

**Contest**: 2000 | **Problem**: A | **Rating**: 800
**Time Limit**: 1 second | **Memory Limit**: 256 megabytes

## Problem Statement

Given an array of $n$ integers, find...

[题目描述，包含数学公式]

## Input

The first line contains...

## Output

Print...

## Examples

### Example 1

**Input**:
\`\`\`
3
1 2 3
\`\`\`

**Output**:
\`\`\`
6
\`\`\`

## Notes

[题目注释]

## Tags

`math`, `implementation`, `brute force`
```

---

## ⚙️ 设置选项

### 打开设置

1. 按 `Ctrl+,`（Mac: `Cmd+,`）
2. 搜索 "**Codeforces**"

### 可用设置

#### 1. Download Path（下载路径）
```json
"codeforces.downloadPath": ""
```

- **默认**：工作区根目录
- **示例**：`"problems/"` - 保存到 problems 文件夹
- **用途**：指定题目保存位置

#### 2. Include Examples（包含示例）
```json
"codeforces.includeExamples": true
```

- **默认**：`true`
- **用途**：是否在 Markdown 中包含测试样例

#### 3. Include Tags（包含标签）
```json
"codeforces.includeTags": false
```

- **默认**：`false`（可能剧透）
- **用途**：是否显示题目标签（如 dp、greedy）

#### 4. Include Notes（包含注释）
```json
"codeforces.includeNotes": true
```

- **默认**：`true`
- **用途**：是否包含题目备注部分

### 完整配置示例

```json
{
  "codeforces.downloadPath": "codeforces/",
  "codeforces.includeExamples": true,
  "codeforces.includeTags": false,
  "codeforces.includeNotes": true
}
```

---

## ❓ 常见问题

### Q1: 必须配置 API 密钥吗？

**A**: 不是必须的！

- ✅ **没有 API**：仍然可以下载题目
- ✅ **有 API**：更快，功能更多

### Q2: API 密钥存储在哪里？

**A**: 安全存储在操作系统的凭证管理器中

- Windows: Credential Manager
- macOS: Keychain
- Linux: Secret Service

### Q3: 如何找到状态栏图标？

**A**: VSCode 窗口右下角

```
┌────────────────────────────────────┐
│                                    │
│          Your Code Here            │
│                                    │
└────────────────────────────────────┘
  Status Bar: [Codeforces] [UTF-8] [LF] ...
                    ↑
              点击这里
```

### Q4: 下载失败怎么办？

**A**: 检查以下几点：

1. **网络连接**：确保能访问 codeforces.com
2. **Contest ID**：确认比赛 ID 正确
3. **Problem Index**：确认题目索引正确（A, B, C...）
4. **Cloudflare**：如果遇到 Cloudflare 验证，请稍后重试

### Q5: 如何更换 API 密钥？

**A**:
1. 点击状态栏图标
2. 选择 "Update API Credentials"
3. 输入新密钥

### Q6: 数学公式显示不正确？

**A**: 使用支持 LaTeX 的 Markdown 预览器

推荐扩展：
- **Markdown Preview Enhanced**
- **Markdown All in One**

---

## ⌨️ 快捷键

### 默认快捷键

| 功能 | Windows/Linux | macOS |
|------|---------------|-------|
| 打开快捷菜单 | `Ctrl+Shift+C` | `Cmd+Shift+C` |
| 命令面板 | `Ctrl+Shift+P` | `Cmd+Shift+P` |

### 自定义快捷键

1. 打开键盘快捷方式：`Ctrl+K Ctrl+S`
2. 搜索 "codeforces"
3. 点击 ✏️ 编辑图标
4. 按下新快捷键
5. 按 `Enter` 保存

---

## 🔧 故障排除

### 问题 1: 扩展未激活

**症状**：
- 状态栏没有 Codeforces 图标
- 命令面板找不到 Codeforces 命令

**解决方案**：
1. 确认扩展已安装：`Ctrl+Shift+X` 查看扩展列表
2. 重新加载 VSCode：`Ctrl+Shift+P` → "Reload Window"
3. 重启 VSCode

---

### 问题 2: API 凭证无效

**症状**：
```
✗ Invalid credentials. Please check your API key and secret.
```

**解决方案**：
1. 重新访问 [API 设置页面](https://codeforces.com/settings/api)
2. 检查 API Key 和 Secret 是否正确
3. 尝试生成新的密钥对
4. 重新配置

---

### 问题 3: 下载超时

**症状**：
```
✗ HTTP 504: Gateway Timeout
```

**解决方案**：
1. 检查网络连接
2. 稍后重试
3. 尝试不使用 API 密钥

---

### 问题 4: Cloudflare 保护

**症状**：
```
✗ Cloudflare protection detected. Cannot fetch problem.
```

**解决方案**：
1. 在浏览器中访问 codeforces.com
2. 完成 Cloudflare 验证
3. 几分钟后重试

---

## 📞 获取帮助

### 内置帮助

1. 点击状态栏 `Codeforces` 图标
2. 选择 "**Help & Documentation**"
3. 选择帮助主题

### 在线资源

- 📖 **文档**: [GitHub README](https://github.com/GeoffreyWang1117/codeforces-helper#readme)
- 🐛 **报告问题**: [GitHub Issues](https://github.com/GeoffreyWang1117/codeforces-helper/issues)
- 💬 **讨论**: [GitHub Discussions](https://github.com/GeoffreyWang1117/codeforces-helper/discussions)

---

## 🎉 开始使用

现在你已经了解了所有功能！

**快速开始**：
1. ✅ 点击状态栏 `Codeforces` 图标
2. ✅ 选择 "Download Single Problem"
3. ✅ 输入 Contest ID: `2000`
4. ✅ 输入 Problem Index: `A`
5. ✅ 享受！

祝你刷题愉快！🚀

---

生成时间: 2025-11-12
版本: 1.0.0
作者: Codeforces Downloader Team
