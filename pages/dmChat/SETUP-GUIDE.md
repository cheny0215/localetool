# 📖 Supabase 聊天室详细设置指南

## 第一步：创建 Supabase 项目

1. 访问 https://supabase.com
2. 点击 "Start your project" 或 "Sign In"
3. 使用 GitHub 账号登录（推荐）或邮箱注册
4. 点击 "New Project"
5. 填写项目信息：
   - **Name**: 例如 `my-chat-room`
   - **Database Password**: 设置一个强密码（记住它！）
   - **Region**: 选择离你最近的区域（例如：东京、新加坡）
6. 点击 "Create new project"
7. 等待 1-2 分钟，项目初始化完成

---

## 第二步：创建数据库表

### 2.1 打开 SQL Editor

1. 在左侧菜单找到并点击 **SQL Editor** 图标（看起来像 `</>`）
2. 点击右上角的 **"New query"** 按钮

### 2.2 执行 SQL 脚本

1. 复制 `supabase-setup.sql` 文件的**全部内容**
2. 粘贴到 SQL Editor 中
3. 点击右下角的 **"Run"** 按钮（或按 Ctrl+Enter）
4. 看到 "Success. No rows returned" 表示成功！

### 2.3 验证表是否创建成功

1. 点击左侧菜单的 **Table Editor** 图标（看起来像表格）
2. 应该能看到 `messages` 表
3. 点击表名，可以看到表结构：
   - id
   - user_id
   - username
   - content
   - type
   - created_at

---

## 第三步：启用实时订阅（重要！）

### 方法 A：检查是否已自动启用

1. 点击左侧菜单的 **Database** 图标
2. 点击顶部的 **Replication** 标签
3. 查看 `messages` 表的状态

**如果看到：**
- ✅ 表名旁边有绿色开关 → 已启用，跳到第四步
- ❌ 表名旁边是灰色开关 → 需要手动启用，继续下面步骤

### 方法 B：手动启用（如果方法 A 未启用）

#### 选项 1：通过界面启用

1. 在 **Database** > **Replication** 页面
2. 找到 `messages` 表
3. 点击表名右侧的**开关按钮**，使其变为绿色
4. 如果提示确认，点击 "Enable"

#### 选项 2：通过 SQL 启用（更可靠）

1. 回到 **SQL Editor**
2. 新建查询，输入：
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE messages;
   ```
3. 点击 "Run"
4. 看到成功提示即可

### 验证实时订阅是否启用

在 SQL Editor 中运行：

```sql
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
```

**期望结果：**
```
schemaname | tablename
-----------+-----------
public     | messages
```

如果看到这个结果，说明实时订阅已成功启用！✅

---

## 第四步：获取项目配置

### 4.1 找到 API 设置

1. 点击左侧菜单底部的 **齿轮图标**（Settings）
2. 在左侧子菜单中点击 **API**

### 4.2 复制配置信息

你会看到两个重要信息：

#### Project URL
```
https://abcdefghijklmn.supabase.co
```
- 这是你的项目地址
- 每个项目都是唯一的

#### API Keys
找到 **anon public** 这一行：
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk1NjcwMDAsImV4cCI6MjAwNTEzNzAwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxx
```
- 这是公开密钥，可以在前端使用
- 不要复制 **service_role** 密钥（那个是私密的）

### 4.3 保存配置

把这两个值记录下来，下一步会用到。

---

## 第五步：配置 HTML 文件

### 5.1 打开文件

用文本编辑器打开 `supabase-chat.html`

### 5.2 找到配置部分

在文件中找到这几行（大约在第 200 行左右）：

```javascript
// ========== Supabase 配置 ==========
// 请替换为你的 Supabase 项目配置
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

### 5.3 替换配置

把刚才复制的值粘贴进去：

```javascript
const SUPABASE_URL = 'https://abcdefghijklmn.supabase.co';  // 你的 Project URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';  // 你的 anon key
```

### 5.4 保存文件

按 Ctrl+S（或 Cmd+S）保存文件

---

## 第六步：测试运行

### 6.1 打开聊天室

1. 双击 `supabase-chat.html` 文件
2. 或者右键 → 打开方式 → 选择浏览器

### 6.2 测试功能

1. **输入昵称**，点击"进入聊天室"
2. **发送一条消息**
3. **打开第二个浏览器窗口**（或无痕模式）
4. 用不同昵称登录
5. 在两个窗口中互相发送消息

**如果能看到：**
- ✅ 消息实时出现在两个窗口
- ✅ 在线人数正确显示
- ✅ 刷新页面后能看到历史消息

**恭喜！设置成功！🎉**

---

## 🔍 调试技巧

### 打开浏览器控制台

按 **F12** 或右键 → 检查，查看 Console 标签

### 正常情况应该看到：

```
正在连接 Supabase...
订阅状态: SUBSCRIBED
在线状态已同步
```

### 如果看到错误：

#### 错误 1: "Invalid API key"
- 检查 SUPABASE_ANON_KEY 是否完整复制
- 确保没有多余的空格或引号

#### 错误 2: "Failed to fetch"
- 检查 SUPABASE_URL 是否正确
- 确保网络连接正常
- 检查 URL 格式：`https://xxxxx.supabase.co`（不要有多余的斜杠）

#### 错误 3: "Realtime subscription failed"
- 回到第三步，重新启用实时订阅
- 运行验证 SQL 确认是否启用

---

## 📊 在 Supabase 中查看数据

### 查看消息记录

1. 进入 **Table Editor**
2. 点击 `messages` 表
3. 可以看到所有发送的消息
4. 可以手动编辑或删除消息

### 查看实时日志

1. 进入 **Logs** > **Realtime**
2. 可以看到所有实时连接和订阅活动

---

## 🎯 下一步

设置成功后，你可以：

1. **自定义样式** - 修改 CSS 部分的颜色和布局
2. **添加功能** - 参考 README 中的扩展建议
3. **部署上线** - 上传到 GitHub Pages、Vercel 等平台
4. **添加认证** - 使用 Supabase Auth 实现真正的用户系统

---

## 💡 小贴士

- Supabase 免费版限制：
  - 500MB 数据库存储
  - 1GB 文件存储
  - 2GB 带宽/月
  - 50,000 月活跃用户
  
- 对于个人项目和小型聊天室完全够用！

- 如果需要更多资源，可以升级到 Pro 版（$25/月）

---

## 🆘 需要帮助？

如果遇到问题：

1. 检查本指南的"调试技巧"部分
2. 查看 Supabase 官方文档：https://supabase.com/docs
3. 检查浏览器控制台的错误信息
4. 确保所有步骤都正确完成

祝你使用愉快！🚀
