# Codeforces Problem Downloader for VS Code

[![Privacy First](https://img.shields.io/badge/Privacy-First-blue)](https://github.com/GeoffreyWang1117/codeforces-helper#privacy)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-green)](https://github.com/GeoffreyWang1117/codeforces-helper)

一键下载 Codeforces 题目为精美的 Markdown 文件 📥✨

## 🎯 三步开始使用

### 1️⃣ 安装扩展后，查看欢迎消息
首次使用时会自动显示快速教程 🎉

### 2️⃣ 点击状态栏图标
在 VSCode 窗口右下角，点击 `Codeforces` 图标

![Status Bar Location](https://via.placeholder.com/600x50/1E3A8A/FFFFFF?text=VSCode+Status+Bar+%E2%86%92+Click+%22Codeforces%22+Icon)

### 3️⃣ 选择操作
- **下载单题**：输入比赛 ID 和题目编号
- **下载整场**：输入比赛 ID，自动下载所有题目
- **配置 API**（可选）：提升下载速度

---

## ✨ 主要特性

- 📥 **一键下载** - 单题或整场比赛
- 📝 **完美格式** - 干净的 Markdown，支持 LaTeX 公式
- 🔢 **测试样例** - 包含输入输出示例
- ⚡ **快速高效** - 可选 API 加速
- 🔒 **隐私优先** - 所有数据本地存储
- 🎨 **可自定义** - 配置下载路径和输出格式

---

## 🚀 如何使用

### 方法 1: 状态栏按钮（最简单）

1. **找到图标**：VSCode 窗口右下角
2. **点击**：`$(cloud-download) Codeforces` 图标
3. **选择操作**：从菜单中选择

### 方法 2: 命令面板（推荐）

1. 按 `Ctrl+Shift+P`（Mac: `Cmd+Shift+P`）
2. 输入 `Codeforces`
3. 选择命令

**可用命令**：
- `Codeforces: Open Menu` - 打开快捷菜单
- `Codeforces: Download Single Problem` - 下载单题
- `Codeforces: Download Contest` - 下载整场比赛
- `Codeforces: Configure API Credentials` - 配置 API
- `Codeforces: Help & Documentation` - 查看帮助

### 方法 3: 快捷键（最快）

按 `Ctrl+Shift+C`（Mac: `Cmd+Shift+C`）直接打开菜单

---

## 🔑 配置 API 密钥（可选）

### 为什么需要 API？

**API 密钥是可选的**，但推荐配置：
- ✅ 更快的下载速度
- ✅ 访问用户数据和完整信息
- ⚠️ 无 API 也能正常下载题目

### 如何获取 API 密钥？

#### 步骤 1: 访问 API 设置页面
1. 登录 [Codeforces](https://codeforces.com)
2. 访问 [codeforces.com/settings/api](https://codeforces.com/settings/api)
3. 复制你的 **API Key** 和 **API Secret**

#### 步骤 2: 在扩展中配置
1. 点击状态栏 `Codeforces` 图标
2. 选择 "**Configure API Credentials**"
3. 按提示输入 API Key 和 Secret

**或使用命令**：
- 按 `Ctrl+Shift+P`
- 输入 `Codeforces: Configure API Credentials`
- 按照提示操作

### API 存储位置

**安全存储** - 本地加密，不会上传：
- 🪟 Windows: Windows Credential Manager
- 🍎 macOS: Keychain
- 🐧 Linux: Secret Service API

---

## 📥 下载示例

### 示例 1: 下载单个题目

```
1. 点击状态栏 "Codeforces" 图标
2. 选择 "Download Single Problem"
3. 输入 Contest ID: 2000
4. 输入 Problem Index: A
5. ✓ 完成！文件保存为 2000-A.md
```

### 示例 2: 下载整场比赛

```
1. 点击状态栏图标
2. 选择 "Download Entire Contest"
3. 输入 Contest ID: 2000
4. ✓ 完成！所有题目保存在 contest-2000/ 文件夹
```

### 下载结果示例

```markdown
# A. Sum of Round Numbers

**Contest**: 2000 | **Problem**: A | **Rating**: 800
**Time Limit**: 1 second | **Memory Limit**: 256 megabytes

## Problem Statement

A positive integer is called *round* if it is of the form $d \times 10^k$...

## Examples

### Example 1

**Input**:
\`\`\`
5
5009
7
9876
10000
10
\`\`\`

**Output**:
\`\`\`
2
5000 9
1
7
4
800 70 6 9000
1
10000
1
10
\`\`\`
```

---

## ⚙️ 配置选项

打开 VSCode 设置 (`Ctrl+,`) 并搜索 "Codeforces"：

```json
{
  // 下载路径（相对于工作区根目录）
  "codeforces.downloadPath": "",

  // 包含测试样例
  "codeforces.includeExamples": true,

  // 包含题目标签（可能剧透）
  "codeforces.includeTags": false,

  // 包含备注部分
  "codeforces.includeNotes": true
}
```

---

## ⌨️ 快捷键

| 功能 | Windows/Linux | macOS |
|------|---------------|-------|
| 打开菜单 | `Ctrl+Shift+C` | `Cmd+Shift+C` |
| 命令面板 | `Ctrl+Shift+P` | `Cmd+Shift+P` |

**自定义快捷键**：
1. 打开键盘快捷方式：`Ctrl+K Ctrl+S`
2. 搜索 "codeforces"
3. 设置你喜欢的快捷键

---

## 🔒 隐私保证

**你的数据完全在本地** - 这是我们的核心承诺：

- ✅ 所有凭证存储在**本地**（OS 级加密）
- ✅ 直接连接到 codeforces.com - **无中间服务器**
- ✅ **零遥测**、零分析、零数据收集
- ✅ **开源代码** - 你可以审计每一行
- ✅ 我们（开发者）**无法访问**你的凭证

---

## 📖 完整文档

详细的使用指南请查看：
- 📘 [用户指南](./USER_GUIDE.md)（中文）
- 📗 [GitHub README](https://github.com/GeoffreyWang1117/codeforces-helper)

---

## ❓ 常见问题

### Q: 必须配置 API 密钥吗？
**A**: 不是必须的！没有 API 也能正常下载题目，配置后会更快。

### Q: 如何找到状态栏图标？
**A**: 在 VSCode 窗口右下角，找到 `Codeforces` 图标并点击。

### Q: API 密钥安全吗？
**A**: 绝对安全！密钥存储在操作系统的凭证管理器中（Windows Credential Manager、macOS Keychain、Linux Secret Service），采用 OS 级加密。

### Q: 下载的文件在哪里？
**A**: 默认保存在工作区根目录。可以在设置中配置 `codeforces.downloadPath`。

### Q: 数学公式显示不正确？
**A**: 使用支持 LaTeX 的 Markdown 预览器，推荐安装：
- **Markdown Preview Enhanced**
- **Markdown All in One**

### Q: 遇到问题怎么办？
**A**:
1. 查看 [用户指南](./USER_GUIDE.md) 的故障排除部分
2. 在 [GitHub Issues](https://github.com/GeoffreyWang1117/codeforces-helper/issues) 报告问题

---

## 🎬 快速开始视频

### 视频教程（即将推出）
- 安装和配置
- 下载第一道题
- 高级功能

---

## 🛠️ 开发

### 构建扩展

```bash
# 安装依赖
pnpm install

# 构建
pnpm build

# 打包为 .vsix
pnpm package

# 开发模式（监听更改）
pnpm dev
```

### 本地测试

1. 按 `F5` 在扩展开发宿主中运行
2. 测试所有功能
3. 查看调试控制台

---

## 🤝 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](../../CONTRIBUTING.md)

### 报告问题
发现 Bug？[创建 Issue](https://github.com/GeoffreyWang1117/codeforces-helper/issues/new)

### 功能请求
有好主意？[告诉我们](https://github.com/GeoffreyWang1117/codeforces-helper/issues/new?labels=enhancement)

---

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE)

---

## 🙏 致谢

- Codeforces 提供优秀的竞赛平台
- 所有贡献者和用户的支持

---

## 📞 联系方式

- 🐛 **Bug 报告**: [GitHub Issues](https://github.com/GeoffreyWang1117/codeforces-helper/issues)
- 💬 **讨论**: [GitHub Discussions](https://github.com/GeoffreyWang1117/codeforces-helper/discussions)
- 📧 **Email**: [geoffreywang1117@gmail.com](mailto:geoffreywang1117@gmail.com)

---

## ⚠️ 免责声明

这是一个非官方工具，与 Codeforces 无关联。请遵守 Codeforces 的使用条款。

---

**为竞赛编程社区制作，用 ❤️ 打造**

**隐私不是可选项 - 而是基本权利。**

---

## 🌟 如果觉得有用，请给个 Star！

[![Star on GitHub](https://img.shields.io/github/stars/GeoffreyWang1117/codeforces-helper?style=social)](https://github.com/GeoffreyWang1117/codeforces-helper)

