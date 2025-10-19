-- 星汉诗词平台 - 完整数据库表结构
-- 将前端硬编码的诗词数据迁移到PostgreSQL数据库
-- 执行前请确保已安装必要的扩展

-- ============================================
-- 1. 依赖扩展
-- ============================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "citext";    -- 大小写不敏感字符串
CREATE EXTENSION IF NOT EXISTS "unaccent";  -- 去除重音符号，支持中文搜索

-- ============================================
-- 2. 朝代表 (dynasties)
-- ============================================
CREATE TABLE IF NOT EXISTS public.dynasties (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  start_year INTEGER,
  end_year INTEGER,
  description TEXT,
  cultural_background TEXT,
  poetry_characteristics TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. 诗人表 (poets)
-- ============================================
CREATE TABLE IF NOT EXISTS public.poets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  dynasty_id INTEGER REFERENCES public.dynasties(id) ON DELETE SET NULL,
  birth_year INTEGER,
  death_year INTEGER,
  biography TEXT,
  style TEXT,
  representative_works TEXT[],
  avatar VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, dynasty_id)
);

-- ============================================
-- 4. 诗词表 (poems) - 核心表
-- ============================================
CREATE TABLE IF NOT EXISTS public.poems (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  author_id INTEGER REFERENCES public.poets(id) ON DELETE CASCADE,
  dynasty_id INTEGER REFERENCES public.dynasties(id) ON DELETE SET NULL,
  content TEXT[] NOT NULL,  -- 诗词内容，按行存储
  tags TEXT[],             -- 标签数组
  category VARCHAR(50),     -- 诗词分类：古诗、词、曲等
  difficulty_level INTEGER DEFAULT 1, -- 难度等级 1-5
  popularity_score INTEGER DEFAULT 0, -- 热度评分
  view_count INTEGER DEFAULT 0,       -- 浏览次数
  like_count INTEGER DEFAULT 0,       -- 点赞次数
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. 诗词赏析表 (poem_analyses)
-- ============================================
CREATE TABLE IF NOT EXISTS public.poem_analyses (
  id SERIAL PRIMARY KEY,
  poem_id INTEGER REFERENCES public.poems(id) ON DELETE CASCADE,
  type VARCHAR(20) DEFAULT 'basic', -- basic, advanced, expert
  background TEXT,                 -- 创作背景
  theme TEXT,                      -- 主题思想
  techniques TEXT[],               -- 艺术手法
  emotions TEXT[],                 -- 情感表达
  imagery TEXT[],                 -- 意象分析
  translation TEXT,               -- 现代译文
  appreciation TEXT,              -- 赏析内容
  ai_generated BOOLEAN DEFAULT FALSE,
  expert_reviewed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. 诗词分类表 (poem_categories)
-- ============================================
CREATE TABLE IF NOT EXISTS public.poem_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. 诗词标签表 (poem_tags)
-- ============================================
CREATE TABLE IF NOT EXISTS public.poem_tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(20) DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. 诗词-标签关联表 (poem_tag_relations)
-- ============================================
CREATE TABLE IF NOT EXISTS public.poem_tag_relations (
  id SERIAL PRIMARY KEY,
  poem_id INTEGER REFERENCES public.poems(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES public.poem_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(poem_id, tag_id)
);

-- ============================================
-- 9. 用户资料表
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  avatar TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. 用户收藏表
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  poem_id INTEGER REFERENCES public.poems(id) ON DELETE CASCADE NOT NULL,
  poem_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, poem_id)
);

-- ============================================
-- 11. 诗词点赞表
-- ============================================
CREATE TABLE IF NOT EXISTS public.poem_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  poem_id INTEGER REFERENCES public.poems(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, poem_id)
);

-- ============================================
-- 12. 诗词评论表
-- ============================================
CREATE TABLE IF NOT EXISTS public.poem_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poem_id INTEGER REFERENCES public.poems(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 13. 社区话题表
-- ============================================
CREATE TABLE IF NOT EXISTS public.community_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tags TEXT[],
  views INTEGER DEFAULT 0, 
  replies INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 14. 话题回复表
-- ============================================
CREATE TABLE IF NOT EXISTS public.topic_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES public.community_topics(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 13. 学习记录表 (study_records)
-- ============================================
CREATE TABLE IF NOT EXISTS public.study_records (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  poem_id INTEGER REFERENCES public.poems(id) ON DELETE CASCADE,
  action VARCHAR(20) NOT NULL, -- read, favorite, study, recite
  duration INTEGER,             -- 学习时长（秒）
  progress INTEGER DEFAULT 0,   -- 学习进度 0-100
  notes TEXT,                   -- 学习笔记
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 14. 索引优化
-- ============================================
-- 朝代表索引
CREATE INDEX IF NOT EXISTS idx_dynasties_name ON public.dynasties(name);
CREATE INDEX IF NOT EXISTS idx_dynasties_years ON public.dynasties(start_year, end_year);

-- 诗人表索引
CREATE INDEX IF NOT EXISTS idx_poets_name ON public.poets(name);
CREATE INDEX IF NOT EXISTS idx_poets_dynasty_id ON public.poets(dynasty_id);
CREATE INDEX IF NOT EXISTS idx_poets_years ON public.poets(birth_year, death_year);

-- 诗词表索引
CREATE INDEX IF NOT EXISTS idx_poems_title ON public.poems(title);
CREATE INDEX IF NOT EXISTS idx_poems_author_id ON public.poems(author_id);
CREATE INDEX IF NOT EXISTS idx_poems_dynasty_id ON public.poems(dynasty_id);
CREATE INDEX IF NOT EXISTS idx_poems_category ON public.poems(category);
CREATE INDEX IF NOT EXISTS idx_poems_difficulty ON public.poems(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_poems_popularity ON public.poems(popularity_score DESC);
CREATE INDEX IF NOT EXISTS idx_poems_created_at ON public.poems(created_at DESC);

-- 文本搜索索引（支持中文搜索）
-- 使用简单的B-tree索引支持LIKE查询
CREATE INDEX IF NOT EXISTS idx_poems_title_lower ON public.poems(lower(title));
-- 注意：由于array_to_string函数在索引中的限制，我们不在content上创建索引
-- 搜索时将使用全表扫描，对于诗词数据量来说是可以接受的

-- 赏析表索引
CREATE INDEX IF NOT EXISTS idx_poem_analyses_poem_id ON public.poem_analyses(poem_id);
CREATE INDEX IF NOT EXISTS idx_poem_analyses_type ON public.poem_analyses(type);

-- 标签关联表索引
CREATE INDEX IF NOT EXISTS idx_poem_tag_relations_poem_id ON public.poem_tag_relations(poem_id);
CREATE INDEX IF NOT EXISTS idx_poem_tag_relations_tag_id ON public.poem_tag_relations(tag_id);

-- 学习记录表索引
CREATE INDEX IF NOT EXISTS idx_study_records_user_id ON public.study_records(user_id);
CREATE INDEX IF NOT EXISTS idx_study_records_poem_id ON public.study_records(poem_id);
CREATE INDEX IF NOT EXISTS idx_study_records_action ON public.study_records(action);
CREATE INDEX IF NOT EXISTS idx_study_records_created_at ON public.study_records(created_at DESC);

-- ============================================
-- 15. 行级安全策略 (RLS)
-- ============================================
-- 启用行级安全
ALTER TABLE public.dynasties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poem_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poem_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poem_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poem_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poem_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poem_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_replies ENABLE ROW LEVEL SECURITY;

-- 基础数据表（公共可读）
CREATE POLICY "dynasties: read all" ON public.dynasties FOR SELECT USING (true);
CREATE POLICY "poets: read all" ON public.poets FOR SELECT USING (true);
CREATE POLICY "poems: read all" ON public.poems FOR SELECT USING (true);
CREATE POLICY "poem_analyses: read all" ON public.poem_analyses FOR SELECT USING (true);
CREATE POLICY "poem_categories: read all" ON public.poem_categories FOR SELECT USING (true);
CREATE POLICY "poem_tags: read all" ON public.poem_tags FOR SELECT USING (true);
CREATE POLICY "poem_tag_relations: read all" ON public.poem_tag_relations FOR SELECT USING (true);

-- 学习记录表（仅本人可访问）
CREATE POLICY "study_records: read own" ON public.study_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "study_records: insert own" ON public.study_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "study_records: update own" ON public.study_records FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "study_records: delete own" ON public.study_records FOR DELETE USING (auth.uid() = user_id);

-- 用户资料表（公共可读 + 本人可写）
CREATE POLICY "profiles: read all" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "profiles: upsert self" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles: update self" ON public.user_profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 用户收藏表（仅本人可访问）
CREATE POLICY "collections: read own" ON public.user_collections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "collections: insert own" ON public.user_collections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "collections: update own" ON public.user_collections FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "collections: delete own" ON public.user_collections FOR DELETE USING (auth.uid() = user_id);

-- 诗词点赞表（公共可读，本人可增删）
CREATE POLICY "likes: read all" ON public.poem_likes FOR SELECT USING (true);
CREATE POLICY "likes: insert own" ON public.poem_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes: delete own" ON public.poem_likes FOR DELETE USING (auth.uid() = user_id);

-- 诗词评论表（公共可读，本人可增改删）
CREATE POLICY "comments: read all" ON public.poem_comments FOR SELECT USING (true);
CREATE POLICY "comments: insert own" ON public.poem_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments: update own" ON public.poem_comments FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments: delete own" ON public.poem_comments FOR DELETE USING (auth.uid() = user_id);

-- 社区话题表（公共可读，本人可增改删）
CREATE POLICY "topics: read all" ON public.community_topics FOR SELECT USING (true);
CREATE POLICY "topics: insert own" ON public.community_topics FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "topics: update own" ON public.community_topics FOR UPDATE USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "topics: delete own" ON public.community_topics FOR DELETE USING (auth.uid() = author_id);

-- 话题回复表（公共可读，本人可增改删）
CREATE POLICY "replies: read all" ON public.topic_replies FOR SELECT USING (true);
CREATE POLICY "replies: insert own" ON public.topic_replies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "replies: update own" ON public.topic_replies FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "replies: delete own" ON public.topic_replies FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 16. 触发器函数
-- ============================================
-- 更新时间触发器
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为所有表添加更新时间触发器
CREATE TRIGGER update_dynasties_updated_at
  BEFORE UPDATE ON public.dynasties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_poets_updated_at
  BEFORE UPDATE ON public.poets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_poems_updated_at
  BEFORE UPDATE ON public.poems
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_poem_analyses_updated_at
  BEFORE UPDATE ON public.poem_analyses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_study_records_updated_at
  BEFORE UPDATE ON public.study_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_collections_updated_at
  BEFORE UPDATE ON public.user_collections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_poem_comments_updated_at
  BEFORE UPDATE ON public.poem_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_topics_updated_at
  BEFORE UPDATE ON public.community_topics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_topic_replies_updated_at
  BEFORE UPDATE ON public.topic_replies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 17. 初始化基础数据
-- ============================================
-- 插入朝代数据
INSERT INTO public.dynasties (name, start_year, end_year, description, cultural_background, poetry_characteristics) VALUES
('先秦', -1046, -221, '中国诗歌的起源时期', '诸子百家思想活跃，文化多元发展', ARRAY['四言诗', '楚辞', '诗经']),
('汉', -206, 220, '诗歌发展的重要时期', '大一统帝国，文化繁荣', ARRAY['乐府诗', '五言诗', '赋']),
('魏晋', 220, 420, '诗歌艺术的成熟期', '玄学兴起，文人雅集', ARRAY['建安风骨', '正始之音', '山水诗']),
('南北朝', 420, 589, '诗歌风格多样化', '南北文化交融', ARRAY['永明体', '宫体诗', '民歌']),
('唐', 618, 907, '中国诗歌的黄金时代', '国力强盛，文化开放', ARRAY['律诗', '绝句', '古体诗', '边塞诗', '田园诗']),
('宋', 960, 1279, '词的繁荣时期', '理学兴起，文化精致', ARRAY['宋词', '婉约派', '豪放派']),
('元', 1271, 1368, '曲的兴起', '蒙古统治，文化融合', ARRAY['元曲', '散曲', '杂剧']),
('明', 1368, 1644, '诗歌复古运动', '程朱理学，文化保守', ARRAY['复古诗', '台阁体']),
('清', 1644, 1912, '诗歌的总结期', '考据学兴起，文化整理', ARRAY['格调派', '性灵派', '肌理派'])
ON CONFLICT (name) DO NOTHING;

-- 插入诗词分类
INSERT INTO public.poem_categories (name, description, icon) VALUES
('古诗', '古代诗歌，包括律诗、绝句等', '📜'),
('词', '宋代兴起的诗歌形式', '🎵'),
('曲', '元代兴起的诗歌形式', '🎭'),
('赋', '古代文体，介于诗和散文之间', '📝'),
('民歌', '民间流传的诗歌', '🎶'),
('唐诗', '唐代诗歌，中国诗歌的黄金时代', '🏔️'),
('宋词', '宋代词作，婉约与豪放并存', '🌸'),
('元曲', '元代散曲和杂剧，通俗文学的代表', '🎪'),
('古风', '古代风格的诗作，不拘格律', '🌙'),
('律诗', '唐代成熟的格律诗体', '⚖️'),
('绝句', '四句短诗，言简意赅', '✂️'),
('乐府', '汉代乐府诗，民间歌谣', '🎼'),
('边塞诗', '描写边塞生活和战争的诗歌', '⚔️'),
('田园诗', '描写田园生活和自然风光的诗歌', '🌾'),
('山水诗', '以山水为题材的诗歌', '🏞️'),
('咏史诗', '以历史为题材的诗歌', '📚'),
('送别诗', '表达离别之情的诗歌', '👋'),
('怀古诗', '怀念古代人事的诗歌', '🏛️'),
('闺怨诗', '表达女子闺中愁怨的诗歌', '💔'),
('咏物诗', '以物为题材的诗歌', '🌺')
ON CONFLICT (name) DO NOTHING;

-- 插入常用标签
INSERT INTO public.poem_tags (name, description, color) VALUES
('思乡', '表达对故乡的思念之情', '#FF6B6B'),
('爱情', '表达爱情主题的诗词', '#FF8E8E'),
('友情', '表达友谊的诗词', '#4ECDC4'),
('山水', '描写自然山水的诗词', '#45B7D1'),
('月亮', '以月亮为意象的诗词', '#96CEB4'),
('春天', '描写春天的诗词', '#FFEAA7'),
('秋天', '描写秋天的诗词', '#DDA0DD'),
('豪放', '豪放风格的诗词', '#FF7675'),
('婉约', '婉约风格的诗词', '#A29BFE'),
('边塞', '边塞题材的诗词', '#6C5CE7'),
('田园', '田园题材的诗词', '#00B894'),
('离别', '表达离别之情的诗词', '#E17055'),
('怀古', '怀古题材的诗词', '#74B9FF'),
('哲理', '蕴含哲理的诗词', '#81ECEC'),
('自然', '描写自然风光的诗词', '#55A3FF')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 18. 数据迁移函数
-- ============================================
-- 创建数据迁移函数，将前端硬编码数据迁移到数据库
CREATE OR REPLACE FUNCTION migrate_frontend_poems()
RETURNS VOID AS $$
BEGIN
  -- 这里可以添加数据迁移逻辑
  -- 将前端硬编码的诗词数据插入到数据库中
  RAISE NOTICE '数据迁移函数已创建，请手动执行数据迁移';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 19. 搜索函数
-- ============================================
-- 创建中文搜索函数（使用LIKE查询）
CREATE OR REPLACE FUNCTION search_poems_chinese(
  search_text TEXT,
  limit_count INTEGER DEFAULT 20
)
RETURNS TABLE(
  id INTEGER,
  title VARCHAR,
  author_name VARCHAR,
  dynasty_name VARCHAR,
  content TEXT[],
  tags TEXT[],
  popularity_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    po.name as author_name,
    d.name as dynasty_name,
    p.content,
    p.tags,
    p.popularity_score
  FROM public.poems p
  JOIN public.poets po ON p.author_id = po.id
  JOIN public.dynasties d ON p.dynasty_id = d.id
  WHERE 
    p.title ILIKE '%' || search_text || '%'
    OR EXISTS (
      SELECT 1 FROM unnest(p.content) as line 
      WHERE line ILIKE '%' || search_text || '%'
    )
    OR po.name ILIKE '%' || search_text || '%'
    OR d.name ILIKE '%' || search_text || '%'
  ORDER BY p.popularity_score DESC, p.like_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 20. 统计函数
-- ============================================
-- 获取诗词统计信息
CREATE OR REPLACE FUNCTION get_poetry_stats()
RETURNS TABLE(
  total_poems BIGINT,
  total_poets BIGINT,
  total_dynasties BIGINT,
  popular_poems JSON
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.poems) as total_poems,
    (SELECT COUNT(*) FROM public.poets) as total_poets,
    (SELECT COUNT(*) FROM public.dynasties) as total_dynasties,
    (
      SELECT json_agg(
        json_build_object(
          'id', p.id,
          'title', p.title,
          'author', po.name,
          'likes', p.like_count
        )
      )
      FROM public.poems p
      JOIN public.poets po ON p.author_id = po.id
      ORDER BY p.like_count DESC
      LIMIT 10
    ) as popular_poems;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 完成提示
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '============================================';
  RAISE NOTICE '星汉诗词平台数据库表结构创建完成！';
  RAISE NOTICE '============================================';
  RAISE NOTICE '已创建的表：';
  RAISE NOTICE '- dynasties (朝代表)';
  RAISE NOTICE '- poets (诗人表)';
  RAISE NOTICE '- poems (诗词表)';
  RAISE NOTICE '- poem_analyses (诗词赏析表)';
  RAISE NOTICE '- poem_categories (诗词分类表)';
  RAISE NOTICE '- poem_tags (诗词标签表)';
  RAISE NOTICE '- poem_tag_relations (诗词标签关联表)';
  RAISE NOTICE '- study_records (学习记录表)';
  RAISE NOTICE '- user_profiles (用户资料表)';
  RAISE NOTICE '- user_collections (用户收藏表)';
  RAISE NOTICE '- poem_likes (诗词点赞表)';
  RAISE NOTICE '- poem_comments (诗词评论表)';
  RAISE NOTICE '- community_topics (社区话题表)';
  RAISE NOTICE '- topic_replies (话题回复表)';
  RAISE NOTICE '============================================';
  RAISE NOTICE '下一步：';
  RAISE NOTICE '1. 执行数据迁移，将前端硬编码数据导入数据库';
  RAISE NOTICE '2. 更新前端服务层，从数据库获取诗词数据';
  RAISE NOTICE '3. 测试数据库集成功能';
  RAISE NOTICE '============================================';
END $$;
