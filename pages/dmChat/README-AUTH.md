# 聊天室用户认证系统 - 使用指南

## 📋 概述

这是一个使用 Supabase Auth 实现的完整用户认证系统，相比原来的简单昵称登录，提供了以下改进：

### ✅ 新功能
- **真实用户认证**：使用邮箱和密码注册/登录
- **持久化用户身份**：用户 ID 由 Supabase 管理，跨设备同步
- **安全性提升**：密码加密存储，防止冒名顶替
- **用户资料管理**：支持昵称、头像、个人简介等
- **会话管理**：自动保持登录状态，支持安全登出
- **邮箱验证**：可选的邮箱验证功能

### ❌ 原系统的问题
- 用户 ID 本地随机生成，不可靠
- 没有密码保护，任何人可以冒用昵称
- 用户信息只存在 localStorage，无法跨设备
- 无法实现用户资料、权限管理等高级功能

---

## 🚀 快速开始

### 1. 数据库设置

在 Supabase Dashboard 中执行 SQL：

1. 打开你的 Supabase 项目
2. 进入 **SQL Editor**
3. 复制 `setup-auth.sql` 的内容
4. 点击 **Run** 执行

这将创建：
- `user_profiles` 表（用户资料）
- RLS 安全策略
- 自动触发器（注册时创建资料）

### 2. 配置 Supabase Auth

#### 2.1 邮箱设置（可选）

进入 **Authentication > Settings**：

- **Enable Email Confirmations**：是否需要邮箱验证
  - 开启：用户注册后需要点击邮件链接验证
  - 关闭：注册后直接可用（推荐开发环境）

#### 2.2 URL 配置

进入 **Authentication > URL Configuration**：

- **Site URL**：你的网站地址（如 `http://localhost:8080` 或生产域名）
- **Redirect URLs**：允许的重定向地址（添加你的域名）

### 3. 使用新版本

将 `index-auth.html` 重命名为 `index.html`（或直接使用）：

```bash
# 备份原文件
mv index.html index-old.html

# 使用新版本
mv index-auth.html index.html
```

---

## 📖 功能说明

### 用户注册

```javascript
// 用户填写表单后
await supabase.auth.signUp({
    email: 'user@example.com',
    password: 'password123',
    options: {
        data: {
            username: '用户昵称'
        }
    }
});
```

**流程：**
1. 用户填写昵称、邮箱、密码
2. 系统创建 Auth 用户
3. 触发器自动创建 `user_profiles` 记录
4. 如果开启邮箱验证，发送验证邮件
5. 验证后（或直接）进入聊天室

### 用户登录

```javascript
await supabase.auth.signInWithPassword({
    email: 'user@example.com',
    password: 'password123'
});
```

**流程：**
1. 用户输入邮箱和密码
2. Supabase 验证凭据
3. 返回 session（包含 JWT token）
4. 自动加载用户资料
5. 进入聊天室

### 会话管理

```javascript
// 检查当前会话
const { data: { session } } = await supabase.auth.getSession();

// 监听认证状态变化
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        // 用户登录
    } else if (event === 'SIGNED_OUT') {
        // 用户登出
    }
});
```

### 用户登出

```javascript
await supabase.auth.signOut();
```

---

## 🗄️ 数据库结构

### user_profiles 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGSERIAL | 主键 |
| user_id | UUID | 关联 auth.users，唯一 |
| username | TEXT | 昵称，唯一 |
| email | TEXT | 邮箱 |
| avatar_url | TEXT | 头像 URL（可选） |
| bio | TEXT | 个人简介（可选） |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### RLS 策略

- ✅ 所有人可以查看用户资料
- ✅ 用户只能创建/更新自己的资料
- ✅ 防止恶意修改他人信息

---

## 🔐 安全性

### 密码安全
- Supabase 使用 bcrypt 加密密码
- 密码永远不会明文存储
- 最小长度 6 位（可在代码中调整）

### Row Level Security (RLS)
- 数据库级别的访问控制
- 用户只能修改自己的资料
- 防止 SQL 注入和越权访问

### JWT Token
- 自动管理 session token
- Token 过期自动刷新
- 安全的跨域认证

---

## 🎨 自定义扩展

### 1. 添加用户头像

修改注册表单，添加头像上传：

```javascript
// 上传头像到 Supabase Storage
const { data, error } = await supabase.storage
    .from('avatars')
    .upload(`${userId}/avatar.jpg`, file);

// 更新用户资料
await supabase
    .from('user_profiles')
    .update({ avatar_url: data.path })
    .eq('user_id', userId);
```

### 2. 添加第三方登录

Supabase 支持 Google、GitHub 等：

```javascript
await supabase.auth.signInWithOAuth({
    provider: 'google'
});
```

在 Dashboard > Authentication > Providers 中配置。

### 3. 密码重置

```javascript
// 发送重置邮件
await supabase.auth.resetPasswordForEmail(email);

// 用户点击邮件链接后，更新密码
await supabase.auth.updateUser({
    password: newPassword
});
```

### 4. 用户资料编辑

```javascript
await supabase
    .from('user_profiles')
    .update({
        username: newUsername,
        bio: newBio
    })
    .eq('user_id', currentUser.id);
```

---

## 🐛 常见问题

### Q: 注册后无法登录？
A: 检查是否开启了邮箱验证。如果开启，需要先验证邮箱。开发环境建议关闭。

### Q: 提示 "User already registered"？
A: 该邮箱已被注册，请使用其他邮箱或直接登录。

### Q: 如何禁用邮箱验证？
A: Dashboard > Authentication > Settings > Enable Email Confirmations 设为 OFF

### Q: 密码要求是什么？
A: 默认最少 6 位，可在代码中修改验证逻辑。

### Q: 如何查看所有注册用户？
A: Dashboard > Authentication > Users 可以查看和管理所有用户。

### Q: 用户资料表没有自动创建？
A: 检查触发器是否正确执行，或在注册代码中手动创建。

---

## 📊 对比：新旧系统

| 功能 | 旧系统 | 新系统 (Auth) |
|------|--------|---------------|
| 用户识别 | 本地随机 ID | Supabase UUID |
| 身份验证 | 无 | 邮箱+密码 |
| 密码保护 | ❌ | ✅ |
| 跨设备同步 | ❌ | ✅ |
| 防冒名顶替 | ❌ | ✅ |
| 用户资料 | 仅昵称 | 完整资料 |
| 会话管理 | localStorage | JWT Token |
| 安全性 | 低 | 高 (RLS) |
| 扩展性 | 差 | 好 |

---

## 🔄 迁移指南

如果你已经有旧版本的用户数据，可以这样迁移：

1. **导出旧数据**（如果需要）
2. **执行 setup-auth.sql**
3. **使用新版 index-auth.html**
4. **通知用户重新注册**（推荐）

或者编写迁移脚本，将旧用户转换为新用户（需要手动设置密码）。

---

## 📚 相关文档

- [Supabase Auth 官方文档](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)

---

## 💡 下一步

- [ ] 添加用户头像上传
- [ ] 实现密码重置功能
- [ ] 添加第三方登录（Google/GitHub）
- [ ] 用户资料编辑页面
- [ ] 在线用户列表显示头像
- [ ] 私聊功能
- [ ] 用户权限管理（管理员/普通用户）

---

**享受更安全、更完善的聊天体验！** 🎉
