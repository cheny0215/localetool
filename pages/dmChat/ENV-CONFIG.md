# 环境变量配置说明

## 配置优先级

代码会按以下顺序查找配置：

1. **环境变量（通过 meta 标签）** - 最高优先级
2. **环境变量（通过全局变量）** - 次优先级
3. **config.js 文件** - 最低优先级

## 方法 1：使用 Meta 标签（推荐用于部署）

在 `index.html` 的 `<head>` 标签中添加：

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Supabase 环境变量 -->
    <meta name="supabase-url" content="https://your-project.supabase.co">
    <meta name="supabase-anon-key" content="your-anon-key-here">
    
    <title>Nexus 聊天室</title>
    ...
</head>
```

### 适用场景：
- 部署到静态托管服务（Vercel、Netlify 等）
- 使用构建工具替换环境变量
- CI/CD 自动部署

### 示例：使用 Vercel 环境变量

1. 在 Vercel 项目设置中添加环境变量：
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

2. 创建构建脚本或使用模板引擎替换 meta 标签

## 方法 2：使用全局变量

在加载 `index.html` 之前，通过 script 标签设置：

```html
<script>
    window.SUPABASE_URL = 'https://your-project.supabase.co';
    window.SUPABASE_ANON_KEY = 'your-anon-key-here';
</script>
```

### 适用场景：
- 动态注入配置
- 服务端渲染（SSR）
- 需要运行时配置

## 方法 3：使用 config.js 文件（开发环境）

创建 `config.js` 文件：

```javascript
const SUPABASE_CONFIG = {
    url: 'https://your-project.supabase.co',
    anonKey: 'your-anon-key-here'
};

if (typeof window !== 'undefined') {
    window.SUPABASE_CONFIG = SUPABASE_CONFIG;
}
```

⚠️ **注意**：记得将 `config.js` 添加到 `.gitignore`

## 完整示例

### 开发环境
使用 `config.js` 文件（已包含在项目中）

### 生产环境（Vercel）

1. 在 Vercel 设置环境变量
2. 创建 `vercel.json`：

```json
{
  "buildCommand": "node scripts/inject-env.js",
  "outputDirectory": "."
}
```

3. 创建 `scripts/inject-env.js`：

```javascript
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../pages/dmChat/index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// 替换 meta 标签
html = html.replace(
    '<meta name="viewport"',
    `<meta name="supabase-url" content="${process.env.SUPABASE_URL}">
    <meta name="supabase-anon-key" content="${process.env.SUPABASE_ANON_KEY}">
    <meta name="viewport"`
);

fs.writeFileSync(htmlPath, html);
console.log('Environment variables injected successfully!');
```

### 生产环境（Netlify）

使用 Netlify 的环境变量和构建插件：

1. 在 Netlify 设置环境变量
2. 创建 `netlify.toml`：

```toml
[build]
  command = "node scripts/inject-env.js"
  publish = "."

[[plugins]]
  package = "@netlify/plugin-env-var-expose"
```

## 测试配置

在浏览器控制台运行：

```javascript
// 检查配置来源
console.log('Meta URL:', document.querySelector('meta[name="supabase-url"]')?.content);
console.log('Global URL:', window.SUPABASE_URL);
console.log('Config URL:', window.SUPABASE_CONFIG?.url);
```

## 安全建议

1. **永远不要**将真实的 API 密钥提交到 Git
2. 使用 `.gitignore` 忽略 `config.js`
3. 在生产环境使用环境变量
4. 定期轮换 API 密钥
5. 使用 Supabase RLS（行级安全）保护数据

## 故障排查

### 配置未找到
- 检查 meta 标签是否正确
- 检查 config.js 是否加载
- 查看浏览器控制台错误

### 配置加载顺序错误
- 确保环境变量在 Supabase SDK 之前加载
- 检查 script 标签顺序

### 部署后无法连接
- 验证环境变量是否正确注入
- 检查 Supabase URL 和 Key 是否有效
- 查看网络请求是否成功
