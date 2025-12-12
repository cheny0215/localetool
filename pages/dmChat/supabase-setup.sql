-- ========================================
-- Supabase 聊天室数据库设置
-- ========================================

-- 1. 创建消息表
CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    username TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'chat' CHECK (type IN ('chat', 'system')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);

-- 3. 启用实时订阅
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- 4. 设置行级安全策略 (RLS)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取消息
CREATE POLICY "允许所有人查看消息"
    ON messages
    FOR SELECT
    USING (true);

-- 允许所有人插入消息
CREATE POLICY "允许所有人发送消息"
    ON messages
    FOR INSERT
    WITH CHECK (true);

-- 5. 创建自动清理旧消息的函数（可选）
-- 保留最近200条消息，自动删除更早的消息
CREATE OR REPLACE FUNCTION cleanup_old_messages()
RETURNS void AS $$
BEGIN
    DELETE FROM messages
    WHERE id NOT IN (
        SELECT id FROM messages
        ORDER BY created_at DESC
        LIMIT 200
    );
END;
$$ LANGUAGE plpgsql;

-- 6. 创建定时任务，每天清理一次（可选）
-- 注意：需要在 Supabase Dashboard 中手动设置 pg_cron 扩展
-- SELECT cron.schedule(
--     'cleanup-old-messages',
--     '0 2 * * *',  -- 每天凌晨2点执行
--     'SELECT cleanup_old_messages();'
-- );

-- ========================================
-- 使用说明
-- ========================================
-- 1. 在 Supabase Dashboard 中打开 SQL Editor
-- 2. 复制并执行上述 SQL 代码
-- 3. 在 Database > Replication 中确保 messages 表已启用实时订阅
-- 4. 获取你的项目 URL 和 anon key
-- 5. 在 HTML 文件中替换 SUPABASE_URL 和 SUPABASE_ANON_KEY
