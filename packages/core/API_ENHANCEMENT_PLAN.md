# API 功能增强计划 - Alpha 0.1

## 🎯 目标

扩展 Codeforces API 客户端，添加更多实用功能，支持用户分析、题目推荐、统计等功能。

## 📊 当前功能（Alpha 基础版）

### 已实现
- ✅ `getContestList()` - 获取比赛列表
- ✅ `getContestStandings()` - 获取比赛排名
- ✅ `getProblems()` - 获取比赛题目
- ✅ `testCredentials()` - 测试 API 凭证

### 限制
- 仅支持基本的比赛和题目获取
- 没有用户相关功能
- 没有题目过滤和搜索
- 没有统计分析

---

## 🚀 Alpha 0.1 新增功能

### 1. 用户功能（User APIs）

#### 1.1 getUserInfo - 获取用户信息
```typescript
async getUserInfo(handles: string[]): Promise<User[]>
```
- 获取一个或多个用户的基本信息
- 包括：handle、评分、排名、贡献等
- 公开 API，无需认证

#### 1.2 getUserStatus - 获取用户提交记录
```typescript
async getUserStatus(handle: string, from?: number, count?: number): Promise<Submission[]>
```
- 获取用户的提交历史
- 支持分页（from, count）
- 可用于分析做题情况

#### 1.3 getUserRating - 获取用户评分变化
```typescript
async getUserRating(handle: string): Promise<RatingChange[]>
```
- 获取用户的评分变化历史
- 用于生成评分曲线图
- 分析进步情况

#### 1.4 getUserStatistics - 用户统计分析（自定义）
```typescript
async getUserStatistics(handle: string): Promise<UserStatistics>
```
- 综合分析用户数据
- 统计：
  - 通过的题目数量
  - 各难度题目分布
  - 各标签题目分布
  - 最近活跃度
  - 强弱项分析

---

### 2. 题目集功能（Problemset APIs）

#### 2.1 getProblemset - 获取完整题目集
```typescript
async getProblemset(tags?: string[]): Promise<ProblemsetResponse>
```
- 获取所有题目
- 支持按标签过滤
- 返回题目和统计信息

#### 2.2 getRecentSubmissions - 获取最近提交
```typescript
async getRecentSubmissions(count?: number): Promise<Submission[]>
```
- 获取全站最近提交
- 实时监控提交状态

#### 2.3 filterProblems - 题目过滤（本地功能）
```typescript
filterProblems(problems: Problem[], options: FilterOptions): Problem[]
```
- 按难度范围过滤
- 按标签过滤
- 按解决人数过滤
- 已做/未做过滤（需要用户数据）

#### 2.4 recommendProblems - 题目推荐（智能功能）
```typescript
async recommendProblems(handle: string, count?: number): Promise<Problem[]>
```
- 基于用户评分推荐题目
- 推荐略高于当前水平的题目
- 考虑用户薄弱标签
- 避免已做题目

---

### 3. 比赛功能增强（Contest APIs）

#### 3.1 getContestHacks - 获取比赛 hack 信息
```typescript
async getContestHacks(contestId: number): Promise<Hack[]>
```
- 获取比赛中的 hack 记录
- 用于学习常见错误

#### 3.2 getContestStatus - 获取比赛提交记录
```typescript
async getContestStatus(contestId: number, handle?: string, from?: number, count?: number): Promise<Submission[]>
```
- 获取比赛提交
- 可以过滤特定用户
- 用于查看他人代码

#### 3.3 getUpcomingContests - 获取即将开始的比赛
```typescript
async getUpcomingContests(): Promise<Contest[]>
```
- 过滤出未来的比赛
- 提醒功能基础

---

### 4. 统计分析功能（Analytics）

#### 4.1 ProblemStatistics - 题目统计
```typescript
interface ProblemStatistics {
  totalProblems: number;
  byRating: Record<number, number>;
  byTags: Record<string, number>;
  averageRating: number;
}
```

#### 4.2 UserProgress - 用户进度分析
```typescript
interface UserProgress {
  solvedCount: number;
  attemptedCount: number;
  acceptanceRate: number;
  favoriteLanguage: string;
  activityCalendar: Record<string, number>; // 日期 -> 提交数
  ratingProgress: number; // 最近30天评分变化
}
```

#### 4.3 TagAnalysis - 标签分析
```typescript
interface TagAnalysis {
  strongTags: string[]; // 擅长的标签
  weakTags: string[]; // 薄弱的标签
  tagAccuracy: Record<string, number>; // 各标签正确率
}
```

---

### 5. 批量操作和缓存

#### 5.1 批量下载优化
```typescript
async downloadProblemsBatch(problemIds: ProblemId[], options: BatchOptions): Promise<BatchResult>
```
- 并发下载多个题目
- 进度回调
- 错误重试

#### 5.2 缓存机制
```typescript
interface CacheOptions {
  enabled: boolean;
  ttl: number; // 缓存时间（秒）
}
```
- 缓存 API 响应
- 减少 API 调用
- 提高性能

---

### 6. 错误处理和重试

#### 6.1 错误类型
```typescript
enum APIErrorType {
  RATE_LIMIT = 'RATE_LIMIT',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR'
}
```

#### 6.2 重试策略
```typescript
interface RetryOptions {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier: number;
}
```

---

## 📋 实现优先级

### P0 - 高优先级（本次实现）
- ✅ getUserInfo
- ✅ getUserStatus
- ✅ getProblemset
- ✅ filterProblems (本地)
- ✅ 基础错误处理

### P1 - 中优先级（下个版本）
- getUserRating
- recommendProblems
- getUserStatistics
- getRecentSubmissions
- 缓存机制

### P2 - 低优先级（未来版本）
- getContestHacks
- getContestStatus
- 高级统计分析
- 可视化支持

---

## 🔒 隐私保证

所有新功能继续遵守隐私优先原则：
- ✅ 所有 API 调用直接到 codeforces.com
- ✅ 无中间服务器
- ✅ 无数据收集
- ✅ 缓存仅存储在本地
- ✅ 用户数据不会上传

---

## 📝 新增类型定义

```typescript
// 用户相关
export interface User {
  handle: string;
  email?: string;
  vkId?: string;
  openId?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  city?: string;
  organization?: string;
  contribution: number;
  rank?: string;
  rating?: number;
  maxRank?: string;
  maxRating?: number;
  lastOnlineTimeSeconds: number;
  registrationTimeSeconds: number;
  friendOfCount: number;
  avatar: string;
  titlePhoto: string;
}

// 提交相关
export interface Submission {
  id: number;
  contestId?: number;
  creationTimeSeconds: number;
  relativeTimeSeconds: number;
  problem: Problem;
  author: Party;
  programmingLanguage: string;
  verdict?: string;
  testset: string;
  passedTestCount: number;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
}

export interface Party {
  contestId?: number;
  members: Member[];
  participantType: string;
  teamId?: number;
  teamName?: string;
  ghost: boolean;
  room?: number;
  startTimeSeconds?: number;
}

export interface Member {
  handle: string;
}

// 评分变化
export interface RatingChange {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

// 题目集响应
export interface ProblemsetResponse {
  problems: Problem[];
  problemStatistics: ProblemStatistic[];
}

export interface ProblemStatistic {
  contestId?: number;
  index: string;
  solvedCount: number;
}

// 过滤选项
export interface FilterOptions {
  minRating?: number;
  maxRating?: number;
  tags?: string[];
  excludeTags?: string[];
  minSolvedCount?: number;
  maxSolvedCount?: number;
}
```

---

## 🧪 测试计划

1. **单元测试**
   - 每个 API 方法的测试
   - Mock API 响应
   - 错误处理测试

2. **集成测试**
   - 真实 API 调用测试
   - 凭证验证测试
   - 缓存功能测试

3. **性能测试**
   - 批量请求性能
   - 缓存命中率
   - 并发处理

---

## 📦 VSCode 扩展新命令

基于新 API 功能，可以添加以下 VSCode 命令：

1. `Codeforces: Analyze User Profile` - 分析用户档案
2. `Codeforces: Recommend Problems` - 推荐题目
3. `Codeforces: Search Problems` - 搜索题目
4. `Codeforces: View Statistics` - 查看统计
5. `Codeforces: Track Progress` - 追踪进度
6. `Codeforces: Upcoming Contests` - 即将开始的比赛

---

## 🎯 成功标准

Alpha 0.1 版本成功标准：
- ✅ 实现 P0 所有功能
- ✅ 通过所有单元测试
- ✅ 更新文档
- ✅ 保持隐私保证
- ✅ VSCode 扩展集成至少 2 个新命令
- ✅ 打包并测试

---

生成时间: 2025-11-12
版本: Alpha 0.1 计划
