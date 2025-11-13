# Codeforces Helper 产品路线图

## 📋 产品规划

### Alpha 版本 - 题目下载器（优先）
**目标**: 完美解析和下载 Codeforces 题目，支持所有数学公式

**核心功能**:
- ✅ 题目下载（单题、整场比赛）
- 🔧 数学公式完美解析（LaTeX + MathML）
- 🔧 测试用例下载
- 🔧 PDF 题目原始下载
- 🔧 批量下载和验证

**发布标准**:
- ✅ 100 场比赛题目下载测试通过
- ✅ 所有数学公式解析正确
- ✅ 测试用例完整下载
- ✅ PDF 题目正确下载
- ✅ 无崩溃和错误

**发布目标**: GitHub Release v1.0.0-alpha

---

### Beta 版本 - 完整浏览器功能（后续）
**分支**: beta-0.1

**核心功能**:
- 浏览器自动化（Puppeteer/Playwright）
- 用户登录
- 代码提交
- 实时判题结果
- 虚拟竞赛
- 代码管理

**发布目标**: GitHub Release v1.0.0-beta

---

## 🎯 Alpha 版本详细计划

### 阶段 1: 数学公式解析增强 ⚠️ **最高优先级**

#### 1.1 问题分析
Codeforces 题目中的数学公式格式：
- **LaTeX 内联公式**: `$...$` 或 `\(...\)`
- **LaTeX 块公式**: `$$...$$` 或 `\[...\]`
- **MathML**: `<span class="tex-font-style-*">...</span>`
- **特殊符号**: HTML entities (≤, ≥, ×, ÷, etc.)

#### 1.2 当前实现问题
```typescript
// packages/core/src/converter/markdown.ts
// 当前可能无法正确处理所有公式格式
```

#### 1.3 改进方案
1. **保留原始 LaTeX**
   - 直接提取 `<span class="tex-*">` 内容
   - 保持 `$...$` 格式用于 Markdown

2. **转换策略**
   ```
   HTML LaTeX → Markdown LaTeX
   <span class="tex-font-size-*">$x^2$</span> → $x^2$
   ```

3. **测试覆盖**
   - 矩阵公式
   - 分数公式
   - 求和/积分
   - 特殊符号
   - 复杂嵌套

---

### 阶段 2: 测试用例下载

#### 2.1 测试用例来源
- **示例测试**: 题目页面中的 examples
- **系统测试**: 提交后可见（需要登录）
- **预测试**: pretests（部分可见）

#### 2.2 实现方案
```typescript
interface TestCase {
  id: number;
  input: string;
  output: string;
  note?: string;
}

async function downloadTestCases(
  contestId: number,
  problemIndex: string
): Promise<TestCase[]>
```

#### 2.3 存储格式
```
contest-{id}/
├── {index}.md           # 题目描述
├── {index}/
│   ├── in1.txt         # 输入1
│   ├── out1.txt        # 输出1
│   ├── in2.txt         # 输入2
│   └── out2.txt        # 输出2
```

---

### 阶段 3: PDF 题目下载

#### 3.1 检测 PDF 题目
```typescript
// 某些比赛（如 Gym）题目为 PDF 格式
// URL: https://codeforces.com/gym/{contestId}/problem/{index}
// 检测方法：查找 PDF 下载链接
```

#### 3.2 下载策略
```typescript
async function downloadProblemPDF(
  contestId: number,
  problemIndex: string,
  savePath: string
): Promise<boolean>
```

#### 3.3 存储
```
contest-{id}/
├── {index}.pdf         # 原始 PDF
└── {index}.md          # 基本信息（如果有）
```

---

### 阶段 4: 批量测试系统

#### 4.1 测试目标
测试 **100 场比赛**，覆盖：
- 各种难度（Div 1, 2, 3, 4, Educational）
- 不同时间段（新旧题目）
- 特殊比赛（Gym, ICPC）
- 各种公式类型

#### 4.2 测试脚本
```typescript
// tests/batch-download.test.ts
interface TestResult {
  contestId: number;
  problemCount: number;
  successCount: number;
  failedProblems: string[];
  formulaErrors: FormulaError[];
  duration: number;
}

async function testContestBatch(
  contestIds: number[]
): Promise<TestResult[]>
```

#### 4.3 验证标准
每个题目必须：
- ✅ Markdown 文件生成
- ✅ 无解析错误
- ✅ 公式格式正确
- ✅ 测试用例完整
- ✅ 图片正确下载（如有）

---

### 阶段 5: 公式验证系统

#### 5.1 公式提取
```typescript
function extractFormulas(markdown: string): {
  inline: string[];      // $...$
  block: string[];       // $$...$$
  total: number;
}
```

#### 5.2 公式验证
```typescript
function validateFormula(latex: string): {
  valid: boolean;
  error?: string;
  type: 'inline' | 'block';
}
```

#### 5.3 常见公式测试
```latex
# 基础
$x^2 + y^2 = r^2$

# 分数
$\frac{a}{b}$

# 求和
$\sum_{i=1}^{n} i$

# 矩阵
$\begin{pmatrix} a & b \\ c & d \end{pmatrix}$

# 积分
$\int_a^b f(x) dx$

# 极限
$\lim_{x \to \infty} f(x)$
```

---

## 🧪 测试计划

### 100 场比赛选择策略

#### 分类（各 25 场）:

**1. Regular Contests (25)**
- Codeforces Round #900-950 (最新)
- Codeforces Round #800-850 (较新)
- Codeforces Round #700-750 (中期)
- Codeforces Round #600-650 (早期)
- Codeforces Round #500-550 (很早)

**2. Educational Rounds (25)**
- Educational Round #150-160
- Educational Round #140-150
- Educational Round #130-140
- Educational Round #120-130
- Educational Round #110-120

**3. Div 1/2/3/4 混合 (25)**
- Div 1: 10 场
- Div 2: 10 场
- Div 3: 3 场
- Div 4: 2 场

**4. Special/Gym (25)**
- ICPC 预选赛
- Global Rounds
- Gym 比赛
- Hello/Goodbye 系列
- April Fools

---

## 📊 测试报告格式

### 总体报告
```markdown
# Batch Download Test Report

## Summary
- Total Contests: 100
- Total Problems: ~600
- Success Rate: 99.5%
- Failed Problems: 3
- Formula Errors: 0
- Average Time per Contest: 15s

## Detailed Results
| Contest ID | Problems | Success | Failed | Formulas | Time |
|------------|----------|---------|--------|----------|------|
| 2000       | 7        | 7       | 0      | 45       | 12s  |
| 1999       | 6        | 6       | 0      | 38       | 11s  |
...

## Failed Problems
1. Contest 1950, Problem F - Reason: Network timeout
2. Contest 1880, Problem G - Reason: PDF download failed
3. Contest 1750, Problem E - Reason: HTML parsing error

## Formula Analysis
- Total Formulas: 2,500+
- Inline Formulas: 1,800
- Block Formulas: 700
- Complex Formulas: 250
- Validation Errors: 0

## Recommendations
[Based on test results]
```

---

## 🚀 发布流程

### Pre-Release Checklist
- [ ] 100 场比赛测试通过
- [ ] 公式解析 100% 正确
- [ ] 文档完整（README, CHANGELOG）
- [ ] 代码质量检查（ESLint, Prettier）
- [ ] 构建成功（所有平台）
- [ ] 性能测试（内存、速度）
- [ ] 安全审计（无敏感信息泄露）

### Release 步骤
1. **更新版本号**: `1.0.0-alpha.1`
2. **生成 CHANGELOG**
3. **构建所有产品**:
   - VSCode Extension (.vsix)
   - Browser Extension (.zip)
   - Core Library (npm package)
4. **创建 Git Tag**: `v1.0.0-alpha.1`
5. **GitHub Release**:
   - 附加所有构建产物
   - 详细的 Release Notes
   - 使用说明
6. **发布公告**

### Release Assets
```
codeforces-helper-v1.0.0-alpha.1/
├── codeforces-downloader-vscode-1.0.0.vsix
├── codeforces-downloader-chrome-1.0.0.zip
├── codeforces-downloader-core-1.0.0.tgz
├── CHANGELOG.md
├── README.md
├── LICENSE
└── test-report.md
```

---

## 📝 Beta 版本预览

### Beta 0.1 功能清单

#### 浏览器自动化
- Puppeteer/Playwright 集成
- Headless 浏览器控制
- Cookie 管理

#### 用户认证
- 登录表单自动填写
- Session 管理
- 多账户支持

#### 代码提交
- 语言选择
- 代码上传
- 提交确认

#### 判题监控
- 实时状态更新
- 测试点详情
- 错误信息提取

#### 虚拟竞赛
- 参加比赛
- 倒计时
- 排名查看

---

## 🎯 里程碑

### Milestone 1: Alpha Ready
**ETA**: 2-3 天
- 公式解析完善
- PDF 下载实现
- 测试用例下载

### Milestone 2: Testing Complete
**ETA**: 1 周
- 100 场比赛测试
- Bug 修复
- 性能优化

### Milestone 3: Alpha Release
**ETA**: 1.5 周
- 文档完善
- 发布准备
- GitHub Release

### Milestone 4: Beta Planning
**ETA**: 2 周
- Beta 架构设计
- 技术选型
- 原型开发

---

## 📚 相关资源

### 技术文档
- [Codeforces API](https://codeforces.com/apiHelp)
- [Markdown Spec](https://spec.commonmark.org/)
- [LaTeX Math](https://en.wikibooks.org/wiki/LaTeX/Mathematics)
- [MathJax](https://www.mathjax.org/)

### 测试工具
- Vitest (单元测试)
- Playwright (E2E 测试)
- K6 (性能测试)

---

生成时间: 2025-11-12
当前版本: Alpha 0.1
目标版本: Alpha 1.0.0
