// Supabase 配置文件示例
// 使用方法：
// 1. 复制此文件并重命名为 config.js
// 2. 填入你的实际配置
// 3. 确保 config.js 已添加到 .gitignore

const SUPABASE_CONFIG = {
    url: 'https://meowmnllbjzhzxxsczhv.supabase.co',           // 例如: https://xxxxx.supabase.co
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb3dtbmxsYmp6aHp4eHNjemh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NDYzMjksImV4cCI6MjA4MTAyMjMyOX0.GvGMsRWT8OSIW33yhceblaCN6auvijOvRTC2Mqurgrw'   // 你的 anon public key
};

// 不要修改下面的代码
if (typeof window !== 'undefined') {
    window.SUPABASE_CONFIG = SUPABASE_CONFIG;
}
