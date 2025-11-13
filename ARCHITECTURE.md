# Codeforces Downloader - 多平台插件架构设计

## 🎯 目标平台

### 主要平台（共享大部分代码）
1. **VS Code Extension** + **Open VSX**
   - 同一套代码库
   - TypeScript
   - VS Code Extension API

2. **浏览器扩展** (Chrome/Edge/Brave/Opera)
   - Manifest V3
   - JavaScript/TypeScript
   - Chrome Extension API

3. **Obsidian Plugin**
   - TypeScript
   - Obsidian Plugin API

---

## 🏗️ Monorepo 项目结构

```
codeforces-downloader/
│
├── packages/
│   ├── core/                      # 核心共享代码
│   │   ├── src/
│   │   │   ├── api/
│   │   │   │   ├── client.ts      # API 客户端
│   │   │   │   ├── auth.ts        # 认证和签名
│   │   │   │   └── types.ts       # API 类型定义
│   │   │   │
│   │   │   ├── scraper/
│   │   │   │   ├── html-parser.ts # HTML 解析
│   │   │   │   └── cloudflare.ts  # Cloudflare 处理
│   │   │   │
│   │   │   ├── converter/
│   │   │   │   ├── markdown.ts    # HTML to Markdown
│   │   │   │   ├── latex.ts       # LaTeX 公式处理
│   │   │   │   └── templates.ts   # 题目模板
│   │   │   │
│   │   │   └── utils/
│   │   │       ├── storage.ts     # 跨平台存储抽象
│   │   │       └── logger.ts      # 日志工具
│   │   │
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── vscode/                    # VS Code 扩展
│   │   ├── src/
│   │   │   ├── extension.ts       # 扩展入口
│   │   │   ├── commands/          # 命令实现
│   │   │   │   ├── download-contest.ts
│   │   │   │   ├── download-problem.ts
│   │   │   │   └── sync-latest.ts
│   │   │   │
│   │   │   ├── views/             # 侧边栏视图
│   │   │   │   └── contest-explorer.ts
│   │   │   │
│   │   │   └── config/            # 配置管理
│   │   │       └── settings.ts
│   │   │
│   │   ├── resources/             # 图标和资源
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── browser-extension/         # 浏览器扩展
│   │   ├── src/
│   │   │   ├── background/
│   │   │   │   └── service-worker.ts
│   │   │   │
│   │   │   ├── content/
│   │   │   │   └── content-script.ts
│   │   │   │
│   │   │   ├── popup/
│   │   │   │   ├── popup.html
│   │   │   │   ├── popup.ts
│   │   │   │   └── popup.css
│   │   │   │
│   │   │   └── options/
│   │   │       ├── options.html
│   │   │       └── options.ts
│   │   │
│   │   ├── manifest.json          # Manifest V3
│   │   ├── icons/
│   │   └── README.md
│   │
│   └── obsidian/                  # Obsidian 插件
│       ├── src/
│       │   ├── main.ts            # 插件主文件
│       │   ├── settings.ts        # 设置面板
│       │   ├── modals/            # 对话框
│       │   │   └── download-modal.ts
│       │   │
│       │   └── commands/          # 命令
│       │       └── download-commands.ts
│       │
│       ├── manifest.json
│       ├── styles.css
│       └── README.md
│
├── python-legacy/                 # 原 Python 代码（参考）
│   ├── crawler.py
│   ├── crawler2.py
│   └── pdfscraper.py
│
├── docs/                          # 文档
│   ├── user-guide.md
│   ├── api-reference.md
│   └── publishing.md
│
├── .github/
│   └── workflows/
│       ├── build-vscode.yml
│       ├── build-browser.yml
│       └── build-obsidian.yml
│
├── pnpm-workspace.yaml            # pnpm monorepo 配置
├── package.json                   # 根 package.json
├── tsconfig.base.json             # 共享 TypeScript 配置
└── README.md
```

---

## 🔧 核心模块设计

### 1. API 模块 (`@cf-downloader/core/api`)

```typescript
// packages/core/src/api/client.ts
export class CodeforceAPI {
  constructor(
    private apiKey?: string,
    private apiSecret?: string
  ) {}

  async getContestList(): Promise<Contest[]>
  async getContestStandings(contestId: number): Promise<ContestStandings>
  async getProblem(contestId: number, index: string): Promise<Problem>
}

// packages/core/src/api/auth.ts
export class APIAuthenticator {
  generateSignature(
    method: string,
    params: Record<string, any>
  ): string
}
```

### 2. Scraper 模块 (`@cf-downloader/core/scraper`)

```typescript
// packages/core/src/scraper/html-parser.ts
export class ProblemScraper {
  async scrapeProblem(url: string): Promise<ProblemHTML>

  private parseStatement(html: string): string
  private parseExamples(html: string): Example[]
  private parseConstraints(html: string): string
}
```

### 3. Converter 模块 (`@cf-downloader/core/converter`)

```typescript
// packages/core/src/converter/markdown.ts
export class MarkdownConverter {
  convert(problem: Problem): string

  private convertLatex(html: string): string
  private formatExamples(examples: Example[]): string
  private applyTemplate(content: TemplateData): string
}
```

### 4. Storage 抽象层

```typescript
// packages/core/src/utils/storage.ts
export interface IStorage {
  get(key: string): Promise<any>
  set(key: string, value: any): Promise<void>
  delete(key: string): Promise<void>
}

// VS Code 实现
export class VSCodeStorage implements IStorage {
  constructor(private context: vscode.ExtensionContext) {}
  // 使用 context.globalState
}

// Browser 实现
export class BrowserStorage implements IStorage {
  // 使用 chrome.storage.local
}

// Obsidian 实现
export class ObsidianStorage implements IStorage {
  // 使用 Plugin.loadData/saveData
}
```

---

## 🎨 平台特定功能

### VS Code Extension

**核心功能**:
1. 命令面板命令
   - `Codeforces: Download Contest`
   - `Codeforces: Download Problem`
   - `Codeforces: Search Problems`
   - `Codeforces: Sync Latest`

2. 侧边栏视图
   - Contest Explorer（显示竞赛列表）
   - Problem Browser（浏览题目）

3. 配置项
   - API 密钥管理
   - 下载目录设置
   - Markdown 模板自定义

**package.json 关键配置**:
```json
{
  "name": "codeforces-downloader",
  "displayName": "Codeforces Problem Downloader",
  "publisher": "your-name",
  "categories": ["Other"],
  "activationEvents": ["onCommand:codeforces.downloadContest"],
  "contributes": {
    "commands": [...],
    "viewsContainers": {...},
    "configuration": {...}
  }
}
```

### Browser Extension

**核心功能**:
1. Context Menu（右键菜单）
   - 在 Codeforces 页面上右键下载当前题目

2. Popup（弹出窗口）
   - 快速输入竞赛 ID 下载
   - 显示下载历史

3. Content Script
   - 在 Codeforces 页面注入下载按钮

**manifest.json**:
```json
{
  "manifest_version": 3,
  "name": "Codeforces Downloader",
  "permissions": ["storage", "contextMenus"],
  "host_permissions": ["*://codeforces.com/*"],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [{
    "matches": ["*://codeforces.com/*"],
    "js": ["content.js"]
  }]
}
```

### Obsidian Plugin

**核心功能**:
1. Ribbon Icon（侧边栏图标）
   - 快速打开下载对话框

2. Commands
   - Download Contest to Current Folder
   - Search Codeforces Problems

3. Settings Tab
   - API 配置
   - 文件命名模板
   - 默认保存位置

**manifest.json**:
```json
{
  "id": "codeforces-downloader",
  "name": "Codeforces Downloader",
  "version": "1.0.0",
  "minAppVersion": "0.15.0",
  "author": "Your Name",
  "authorUrl": "https://github.com/your-name"
}
```

---

## 📦 构建和打包

### 工具链
- **包管理器**: pnpm（支持 monorepo）
- **构建工具**: esbuild / Rollup
- **类型检查**: TypeScript
- **测试**: Vitest
- **代码质量**: ESLint + Prettier

### 构建命令
```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm build

# 构建特定平台
pnpm build:vscode
pnpm build:browser
pnpm build:obsidian

# 开发模式（热重载）
pnpm dev:vscode
pnpm dev:browser
pnpm dev:obsidian

# 打包发布
pnpm package:vscode    # 生成 .vsix
pnpm package:browser   # 生成 .zip
pnpm package:obsidian  # 生成 .zip
```

### 根目录 package.json
```json
{
  "name": "codeforces-downloader-monorepo",
  "private": true,
  "scripts": {
    "build": "pnpm -r build",
    "build:vscode": "pnpm --filter @cf-downloader/vscode build",
    "build:browser": "pnpm --filter @cf-downloader/browser build",
    "build:obsidian": "pnpm --filter @cf-downloader/obsidian build",
    "dev:vscode": "pnpm --filter @cf-downloader/vscode dev",
    "test": "vitest"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "esbuild": "^0.19.11",
    "vitest": "^1.2.0"
  }
}
```

---

## 🚀 发布流程

### VS Code Marketplace + Open VSX
```bash
# 使用 vsce 打包
cd packages/vscode
npx vsce package

# 发布到 VS Code Marketplace
npx vsce publish

# 发布到 Open VSX
npx ovsx publish
```

### Chrome Web Store
1. 打包扩展为 .zip
2. 登录 Chrome Developer Dashboard
3. 上传并提交审核
4. Edge/Brave/Opera 会自动兼容

### Obsidian Community Plugins
1. Fork obsidian-releases repo
2. 添加插件信息到 community-plugins.json
3. 提交 Pull Request
4. 等待社区审核

---

## 🔐 安全考虑

### API 密钥存储
- **VS Code**: 使用 `SecretStorage` API
- **Browser**: 使用 `chrome.storage.local`（加密）
- **Obsidian**: 使用插件数据存储（提醒用户保护）

### CORS 处理
- 浏览器扩展：利用 background script 绕过 CORS
- VS Code/Obsidian：Node.js 环境，无 CORS 限制

---

## 📊 优先级建议

### Phase 1: 核心开发
1. 搭建 monorepo 结构
2. 实现 `@cf-downloader/core`
3. 编写单元测试

### Phase 2: VS Code 插件
- 最容易开发
- 用户群体大
- 文件操作直接

### Phase 3: 浏览器扩展
- 用户体验最好（直接在网页上使用）
- 需要处理 CORS 和权限

### Phase 4: Obsidian 插件
- 用户群体相对小众
- 但高度匹配使用场景（知识管理）

---

## 🎯 下一步行动

1. ✅ 初始化 monorepo 结构
2. ✅ 配置 TypeScript 和构建工具
3. ✅ 实现核心 API 模块
4. ✅ 实现 Scraper 模块
5. ✅ 实现 Markdown 转换器
6. ✅ 开发 VS Code 扩展
7. ✅ 测试和优化
8. ✅ 发布第一个版本

需要我开始实施吗？
