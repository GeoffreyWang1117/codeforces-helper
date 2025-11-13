# Codeforces 爬虫项目分析报告

## 📊 现状评估

### ✅ API 测试结果
- **公开 API**: 正常工作
- **认证 API**: 正常工作
- **网页爬取**: 正常工作
- **最新竞赛**: Educational Codeforces Round 185

### 🔧 现有功能
1. **crawler.py** - 主爬虫
   - 使用 Codeforces API 获取竞赛题目列表
   - 爬取题目页面（HTML）
   - 转换为 Markdown 格式
   - 处理数学公式（LaTeX）
   - 提取输入/输出示例

2. **crawler2.py** - 带 PDF 下载
   - 包含 crawler.py 所有功能
   - 当页面被 Cloudflare 保护时，尝试下载 PDF

3. **pdfscraper.py** - PDF 下载器
   - 使用 Selenium 模拟浏览器
   - 提取真实 PDF URL
   - 下载题目 PDF 版本

### ⚠️ 发现的问题
1. **依赖管理**: 缺少 requirements.txt（已创建）
2. **配置文件**: secret.txt 包含敏感 API 密钥（应加入 .gitignore）
3. **硬编码路径**: pdfscraper.py 中 chromedriver 路径需要配置
4. **错误处理**: 部分错误处理不够完善

---

## 🎯 多平台插件改造方案

### 平台分类

#### 1. 编辑器插件
- **VS Code Extension** (TypeScript/JavaScript)
- **Open VSX** (与 VS Code 兼容，同一套代码)

#### 2. 浏览器扩展
- **Chrome Web Store** (Manifest V3)
- **Edge Add-ons** (与 Chrome 兼容)
- **Brave/Opera** (与 Chrome 兼容)

#### 3. 知识管理工具
- **Obsidian Plugin** (TypeScript)

### 🏗️ 技术架构建议

```
codeforces-downloader/
├── core/                    # 核心逻辑（JavaScript/TypeScript）
│   ├── api.ts              # Codeforces API 封装
│   ├── scraper.ts          # 网页爬取逻辑
│   ├── converter.ts        # HTML to Markdown 转换
│   └── utils.ts            # 工具函数
│
├── packages/
│   ├── vscode/             # VS Code 插件
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── browser/            # 浏览器扩展
│   │   ├── manifest.json   # Manifest V3
│   │   ├── background.js
│   │   ├── content.js
│   │   └── popup.html
│   │
│   └── obsidian/           # Obsidian 插件
│       ├── src/
│       ├── manifest.json
│       └── package.json
│
└── python-legacy/          # 原 Python 代码（参考用）
```

### 🔑 关键技术点

#### VS Code + Obsidian
- **语言**: TypeScript
- **共享点**:
  - API 调用逻辑
  - Markdown 转换
  - 文件系统操作
- **差异**:
  - VS Code: 使用 VS Code API
  - Obsidian: 使用 Obsidian Plugin API

#### 浏览器扩展
- **语言**: JavaScript/TypeScript
- **共享点**:
  - API 调用
  - DOM 解析
- **差异**:
  - 使用 Chrome Extension API
  - 需要处理 CORS
  - 使用 chrome.storage

### 📦 发布渠道差异

| 平台 | 发布要求 | 审核时间 | 费用 |
|------|---------|---------|------|
| VS Code Marketplace | Microsoft 账号 | 几小时 | 免费 |
| Open VSX | Eclipse 账号 | 自动 | 免费 |
| Chrome Web Store | Google 开发者账号 | 1-3 天 | $5 一次性 |
| Edge Add-ons | Microsoft 账号 | 1-3 天 | 免费 |
| Brave/Opera | 通常接受 Chrome 扩展 | - | 免费 |
| Obsidian | GitHub PR | 社区审核 | 免费 |

---

## 🚀 推荐实施步骤

### Phase 1: 核心重构
1. 将 Python 核心逻辑重写为 TypeScript/JavaScript
2. 创建共享的 npm 包
3. 编写完整的单元测试

### Phase 2: VS Code 插件
1. 创建 VS Code 扩展项目
2. 集成核心模块
3. 添加 UI 交互（命令面板、侧边栏）
4. 发布到 Marketplace 和 Open VSX

### Phase 3: 浏览器扩展
1. 创建 Chrome 扩展（Manifest V3）
2. 实现右键菜单和页面注入
3. 发布到 Chrome/Edge/Brave

### Phase 4: Obsidian 插件
1. 适配 Obsidian Plugin API
2. 集成 vault 文件系统
3. 提交到社区插件库

---

## ⚡ 立即可做的改进

1. 创建 `.gitignore`，保护敏感信息
2. 重构代码为模块化结构
3. 添加配置文件支持（JSON）
4. 创建详细的 README
5. 添加命令行参数支持

---

## 🎨 功能规划

### 核心功能
- ✅ 下载单个竞赛的所有题目
- ✅ 转换为 Markdown 格式
- ✅ 支持数学公式
- ⚠️ PDF 下载（需要后端支持或 headless browser）

### 新增功能建议
- 📅 自动同步最新竞赛
- 🔍 搜索题目（by rating, tags）
- 📊 下载题目统计信息
- 🌐 多语言支持
- ⚙️ 自定义模板
- 🔐 安全的凭证管理（OS keychain）
