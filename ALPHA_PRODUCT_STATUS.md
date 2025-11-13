# Alpha 产品开发状态

## 📊 当前进度：45%

### ✅ 已完成
1. **产品规划** (PRODUCT_ROADMAP.md)
   - Alpha/Beta 产品定义
   - 100 场比赛测试计划
   - 发布标准制定

2. **增强的 HTML 转换器** (html-to-markdown.ts)
   - LaTeX 公式识别和保留
   - 7 种 Codeforces 公式格式支持
   - HTML 实体解码
   - 公式语法验证
   - 完整的 Markdown 转换

3. **Parser 集成完成** (scraper/parser.ts)
   - ✅ 修改 `extractSection()` 使用 `getHTML()`
   - ✅ 保留 HTML 结构和公式信息
   - ✅ 导出新的转换函数

4. **Markdown 转换器更新** (converter/markdown.ts)
   - ✅ 集成 htmlToMarkdown 函数
   - ✅ 所有内容部分使用新转换器
   - ✅ 移除旧的 convertLatex 方法

5. **测试验证**
   - ✅ 创建测试脚本 (test-formula-mock.js)
   - ✅ 验证 15 个公式正确解析
   - ✅ 确认所有 7 种格式支持
   - ✅ 无解析错误

### 🔧 进行中
- 无（等待真实环境测试）

### ⏳ 待完成

#### 高优先级（必须完成才能发布）

3. **实现 PDF 题目下载**
   - 检测 PDF 题目
   - 下载原始 PDF 文件
   - 保存到正确位置

4. **完善测试用例下载**
   - 从示例中提取测试用例
   - 保存为独立文件（in*.txt, out*.txt）
   - 支持批量下载

5. **创建批量测试脚本**
   - 选择 100 场代表性比赛
   - 自动下载和验证
   - 生成测试报告

6. **公式验证和修复**
   - 运行批量测试
   - 修复发现的公式解析问题
   - 确保 100% 正确率

#### 中优先级（改进质量）
1. **错误处理增强**
   - 网络错误重试
   - 超时处理
   - 友好错误信息

2. **性能优化**
   - 并发下载
   - 缓存机制
   - 进度显示

3. **日志系统**
   - 详细的下载日志
   - 错误追踪
   - 性能指标

#### 低优先级（可选功能）
1. **图片下载**
   - 下载题目中的图片
   - 保存到本地
   - 更新 Markdown 引用

2. **多语言支持**
   - 支持俄语题目
   - 自动翻译（可选）

---

## 🎯 接下来的步骤

### ~~Step 1: 集成新转换器~~ ✅ 已完成 (2025-11-13)

**完成内容：**
- ✅ 修改 `scraper/parser.ts` 使用 `getHTML()`
- ✅ 更新 `converter/markdown.ts` 集成 `htmlToMarkdown()`
- ✅ 导出所有必要的函数
- ✅ 创建测试脚本并验证
- ✅ 15 个公式全部正确解析

**测试结果：**
```
✅ 13 inline formulas ($...$)
✅ 2 display formulas ($$...$$)
✅ No parsing errors
✅ All 7 Codeforces formula formats supported
```

**提交信息：**
- Commit: cd95eac
- 文件修改: 5 files
- 新增测试: test-formula-mock.js
- Branch: alpha-0.1

### Step 2: 实现 PDF 下载（下一步）

创建 `packages/core/src/downloader/pdf.ts`:
```typescript
export async function downloadPDF(
  contestId: number,
  problemIndex: string,
  savePath: string
): Promise<boolean> {
  const url = `https://codeforces.com/problemset/problem/${contestId}/${problemIndex}`;

  // 检测是否为 PDF
  const response = await fetch(url);
  const html = await response.text();

  const pdfMatch = html.match(/href="([^"]*\.pdf)"/);
  if (pdfMatch) {
    const pdfUrl = pdfMatch[1];
    // 下载 PDF
    const pdfResponse = await fetch(pdfUrl);
    const buffer = await pdfResponse.arrayBuffer();
    await fs.writeFile(savePath, Buffer.from(buffer));
    return true;
  }

  return false;
}
```

### Step 3: 测试用例保存（明天完成）

创建 `packages/core/src/downloader/testcases.ts`:
```typescript
export async function saveTestCases(
  examples: Example[],
  problemPath: string
): Promise<void> {
  const testDir = path.join(problemPath, 'tests');
  await fs.mkdir(testDir, { recursive: true });

  for (let i = 0; i < examples.length; i++) {
    await fs.writeFile(
      path.join(testDir, `in${i + 1}.txt`),
      examples[i].input
    );
    await fs.writeFile(
      path.join(testDir, `out${i + 1}.txt`),
      examples[i].output
    );
  }
}
```

### Step 4: 批量测试脚本（2-3天完成）

创建 `tests/batch-test.ts`:
```typescript
const CONTEST_IDS = [
  // Regular rounds (25)
  2000, 1999, 1998, ...,

  // Educational (25)
  1900, 1899, 1898, ...,

  // Mixed (25)
  1800, 1799, 1798, ...,

  // Special (25)
  1700, 1699, 1698, ...
];

async function runBatchTest() {
  const results = [];

  for (const contestId of CONTEST_IDS) {
    const result = await testContest(contestId);
    results.push(result);

    console.log(`✓ Contest ${contestId}: ${result.successRate}%`);
  }

  generateReport(results);
}
```

### Step 5: 公式验证和修复（3-5天）

运行测试，修复发现的问题：
```bash
npm run test:batch
# 查看报告
cat test-results/report.md
# 修复问题
# 重新测试
```

---

## 📋 发布检查清单

### 代码完成度
- [ ] 公式解析 100% 正确
- [ ] PDF 下载功能
- [ ] 测试用例保存
- [ ] 100 场比赛测试通过
- [ ] 所有已知 bug 修复

### 文档
- [ ] README 更新
- [ ] CHANGELOG 编写
- [ ] 使用示例
- [ ] API 文档
- [ ] 故障排除指南

### 质量保证
- [ ] 单元测试覆盖率 > 80%
- [ ] 无编译错误/警告
- [ ] 代码格式检查通过
- [ ] 性能测试通过

### 构建
- [ ] VSCode 扩展构建成功
- [ ] 浏览器扩展构建成功
- [ ] Core 库构建成功
- [ ] 所有平台测试通过

### 发布准备
- [ ] 版本号更新 (v1.0.0-alpha.1)
- [ ] Git 标签创建
- [ ] Release Notes 编写
- [ ] 构建产物准备

---

## 🚀 预估时间线

### 本周（Week 1）
- Day 1-2: 集成新转换器，修复 parser
- Day 3-4: 实现 PDF 下载和测试用例保存
- Day 5-7: 创建批量测试脚本，选择 100 场比赛

### 下周（Week 2）
- Day 1-3: 运行批量测试，记录问题
- Day 4-5: 修复公式解析问题
- Day 6-7: 重新测试，确保通过率 100%

### 第三周（Week 3）
- Day 1-2: 完善文档
- Day 3-4: 最终测试和 QA
- Day 5: 构建所有产物
- Day 6: 创建 GitHub Release
- Day 7: 发布公告

---

## 💡 关键技术点

### 公式识别模式
```regex
1. <span class="tex-font-size-*">$...$</span>
2. <span class="tex-font-style-*">$...$</span>
3. Standalone: $...$
4. Display: $$...$$
5. LaTeX: \(...\)
6. LaTeX: \[...\]
7. Codeforces: $$$...$$$
```

### 测试覆盖策略
- **难度覆盖**: Div 1/2/3/4
- **时间覆盖**: 2015-2025
- **类型覆盖**: Regular, Educational, Global, ICPC, Gym
- **公式覆盖**: 简单/复杂/嵌套/矩阵/积分/求和

### 成功标准
- ✅ 100 场比赛全部下载成功
- ✅ ~600+ 题目解析成功
- ✅ 2500+ 公式验证通过
- ✅ 0 公式语法错误
- ✅ 0 崩溃或严重错误

---

## 🐛 已知问题

### ~~已修复~~ ✅
1. ~~parser.ts 使用 getText() 丢失 HTML 结构~~ → 已修改为 getHTML()
2. ~~markdown.ts 转换器过于简单~~ → 已集成 htmlToMarkdown
3. ~~没有公式验证机制~~ → html-to-markdown.ts 包含验证

### 待修复
1. 缺少 PDF 下载功能
2. 测试用例未保存为独立文件
3. 需要真实环境测试（HTTP 403 问题）

### 风险评估
- **高风险**: ~~公式解析（核心功能）~~ → ✅ 已解决
- **中风险**: PDF 下载（部分题目）
- **低风险**: 性能优化（可后续改进）

---

## 📞 下一步行动

### ~~立即执行~~ ✅ 已完成
1. ~~提交当前代码（html-to-markdown.ts）~~ ✅
2. ~~修改 parser.ts 使用新转换器~~ ✅
3. ~~测试单个题目下载~~ ✅（模拟测试）
4. ~~验证公式解析正确性~~ ✅（15/15 通过）

### 下一步（短期）
1. **实现 PDF 下载** - 优先级：高
   - 检测 PDF 格式题目
   - 下载原始 PDF 文件
   - 集成到 VSCode 扩展

2. **实现测试用例保存** - 优先级：高
   - 提取示例输入输出
   - 保存为 in*.txt 和 out*.txt
   - 支持批量处理

3. **创建批量测试脚本** - 优先级：中
   - 选择 100 场代表性比赛
   - 自动下载和验证框架
   - 生成详细测试报告

### 中期目标
1. 真实环境测试（解决 HTTP 403）
2. 完成 100 场比赛测试
3. 性能优化和错误处理

### 长期目标
1. 发布 Alpha 1.0.0 版本
2. 收集用户反馈
3. 开始 Beta 版本规划

---

**最后更新**: 2025-11-13
**当前分支**: alpha-0.1
**进度**: 45% → 目标 Alpha 1.0.0 Release
**最新提交**: cd95eac (Formula parser integration)
