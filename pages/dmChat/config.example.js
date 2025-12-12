// Supabase 配置文件示例
// 使用方法：
// 1. 复制此文件并重命名为 config.js
// 2. 填入你的实际 Supabase 项目配置
// 3. config.js 已在 .gitignore 中，不会被提交到 Git

const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_URL',           // 例如: https://xxxxx.supabase.co
    anonKey: 'YOUR_SUPABASE_ANON_KEY'   // 你的 anon public key
};

// 不要修改下面的代码
if (typeof window !== 'undefined') {
    window.SUPABASE_CONFIG = SUPABASE_CONFIG;
}
