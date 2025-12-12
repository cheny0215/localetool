-- ========================================
-- Supabase 聊天室 - 用户认证设置
-- ========================================

-- 1. 创建用户资料表
CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建索引
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);

-- 3. 启用 RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 4. 创建 RLS 策略
-- 所有人可以查看用户资料
CREATE POLICY "用户资料公开可读" ON user_profiles
    FOR SELECT
    USING (true);

-- 用户只能插入自己的资料
CREATE POLICY "用户可以创建自己的资料" ON user_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 用户只能更新自己的资料
CREATE POLICY "用户可以更新自己的资料" ON user_profiles
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 5. 更新 messages 表，添加外键关联（如果需要）
-- 注意：如果你的 messages 表已经存在，需要先备份数据
ALTER TABLE messages 
    ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 6. 创建触发器：自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. 创建函数：注册时自动创建用户资料（可选）
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, username, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. 创建触发器：用户注册时自动创建资料
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- 完成！
-- ========================================
-- 接下来的步骤：
-- 1. 在 Supabase Dashboard 中执行此 SQL
-- 2. 在 Authentication > Settings 中配置邮箱验证（可选）
-- 3. 在 Authentication > URL Configuration 中设置重定向 URL
-- 4. 测试注册和登录功能
