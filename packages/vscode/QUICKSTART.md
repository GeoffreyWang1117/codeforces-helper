# 快速开始 - Codeforces Downloader

## 🎯 5 分钟上手

### 第一步：找到插件入口（3 种方式）

#### 方式 1：状态栏按钮 ⭐ 推荐
```
VSCode 窗口右下角 → 点击 "Codeforces" 图标
```

#### 方式 2：命令面板
```
Ctrl+Shift+P (Mac: Cmd+Shift+P) → 输入 "Codeforces"
```

#### 方式 3：快捷键
```
Ctrl+Shift+C (Mac: Cmd+Shift+C)
```

---

### 第二步：配置 API 密钥（可选，但推荐）

#### 获取 API 密钥

1. **登录 Codeforces**
   - 访问：https://codeforces.com
   - 登录你的账号

2. **打开 API 设置**
   - 访问：https://codeforces.com/settings/api
   - 或者：点击用户名 → Settings → API

3. **复制密钥**
   - 复制 **API Key**（一串字母数字）
   - 复制 **API Secret**（一串字母数字）

#### 在扩展中配置

1. 点击状态栏 "Codeforces" 图标
2. 选择 "**Configure API Credentials**"
3. 粘贴 API Key
4. 粘贴 API Secret
5. ✅ 完成！

**存储位置**（安全本地存储）：
- Windows: Credential Manager
- macOS: Keychain
- Linux: Secret Service

---

### 第三步：下载第一道题

#### 示例：下载 Contest 2000 的 Problem A

1. **打开菜单**
   - 点击状态栏 "Codeforces" 图标

2. **选择 "Download Single Problem"**

3. **输入信息**
   ```
   Contest ID: 2000
   Problem Index: A
   ```

4. **查看结果**
   - 文件自动打开：`2000-A.md`
   - 保存位置：工作区根目录

---

## 📖 常用操作

### 下载单个题目
```
1. 点击 Codeforces 图标
2. 选择 "Download Single Problem"
3. 输入 Contest ID（如：2000）
4. 输入 Problem Index（如：A）
```

### 下载整场比赛
```
1. 点击 Codeforces 图标
2. 选择 "Download Entire Contest"
3. 输入 Contest ID（如：2000）
4. 等待下载完成
5. 所有题目保存在 contest-2000/ 文件夹
```

### 更新 API 密钥
```
1. 点击 Codeforces 图标
2. 选择 "Update API Credentials"
3. 输入新的密钥
```

### 清除 API 密钥
```
1. 点击 Codeforces 图标
2. 选择 "Clear API Credentials"
3. 确认删除
```

---

## ⚙️ 快速设置

按 `Ctrl+,` 打开设置，搜索 "Codeforces"：

```json
{
  // 下载路径（相对工作区根目录）
  "codeforces.downloadPath": "",

  // 包含测试样例
  "codeforces.includeExamples": true,

  // 包含标签（可能剧透）
  "codeforces.includeTags": false,

  // 包含备注
  "codeforces.includeNotes": true
}
```

---

## ❓ 常见问题速查

### Q: API 必须配置吗？
**A**: 不是必须的，但推荐配置以获得更快速度。

### Q: 状态栏图标在哪里？
**A**: VSCode 窗口右下角，找 "Codeforces" 文字。

### Q: 下载的文件在哪里？
**A**: 默认在工作区根目录，可在设置中更改路径。

### Q: 数学公式显示不正确？
**A**: 安装 Markdown Preview Enhanced 扩展。

### Q: 下载失败？
**A**:
1. 检查网络连接
2. 确认 Contest ID 正确
3. 稍后重试

---

## 🆘 获取帮助

### 内置帮助
```
点击 Codeforces 图标 → 选择 "Help & Documentation"
```

### 在线资源
- 📘 完整文档：[USER_GUIDE.md](./USER_GUIDE.md)
- 🐛 问题反馈：https://github.com/GeoffreyWang1117/codeforces-helper/issues
- 💬 讨论区：https://github.com/GeoffreyWang1117/codeforces-helper/discussions

---

## ⌨️ 快捷键

| 功能 | Windows/Linux | macOS |
|------|---------------|-------|
| 打开菜单 | Ctrl+Shift+C | Cmd+Shift+C |
| 命令面板 | Ctrl+Shift+P | Cmd+Shift+P |
| 设置 | Ctrl+, | Cmd+, |

---

## 🎉 就是这么简单！

现在开始享受刷题吧！

**记住**：
- ✅ 点击状态栏图标即可开始
- ✅ API 密钥是可选的
- ✅ 所有数据本地存储，完全隐私

Happy Coding! 🚀

