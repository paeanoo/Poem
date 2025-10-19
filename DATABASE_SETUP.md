# 数据库设置指南

## 问题描述

如果您在访问收藏页面时遇到以下错误：
```
Could not find the table 'public.user_collections' in the schema cache
```

这表示Supabase数据库中还没有创建必要的表结构。

## 解决方案

### 步骤1：打开Supabase控制台

1. 访问 [Supabase控制台](https://supabase.com/dashboard)
2. 选择您的项目：`ewmcxlhboucnpawqfyxh`
3. 进入项目控制台

### 步骤2：执行SQL脚本

1. 在左侧菜单中点击 **SQL Editor**
2. 点击 **New Query** 创建新的查询
3. 复制项目根目录下 `supabase-schema.sql` 文件的全部内容
4. 粘贴到SQL编辑器中
5. 点击 **Run** 执行脚本

### 步骤3：验证表创建

执行完成后，您应该能看到以下表被创建：

- `user_profiles` - 用户资料表
- `user_collections` - 用户收藏表
- `poem_likes` - 诗词点赞表
- `poem_comments` - 诗词评论表
- `community_topics` - 社区话题表
- `topic_replies` - 话题回复表

### 步骤4：测试功能

1. 返回应用程序
2. 刷新收藏页面
3. 尝试收藏一首诗词
4. 检查收藏功能是否正常工作

## 表结构说明

### user_collections (用户收藏表)
```sql
- id: UUID (主键)
- user_id: UUID (用户ID，关联auth.users)
- poem_id: TEXT (诗词ID)
- poem_data: JSONB (诗词数据)
- created_at: TIMESTAMP (创建时间)
- updated_at: TIMESTAMP (更新时间)
```

### poem_likes (诗词点赞表)
```sql
- id: UUID (主键)
- user_id: UUID (用户ID)
- poem_id: TEXT (诗词ID)
- created_at: TIMESTAMP (创建时间)
```

### 其他表
详细结构请参考 `supabase-schema.sql` 文件。

## 权限设置

脚本已自动配置：
- 行级安全策略 (RLS)
- 用户权限控制
- 数据访问限制

## 故障排除

### 如果仍然遇到错误：

1. **检查环境变量**
   ```bash
   # 确保 .env 文件包含正确的Supabase配置
   VITE_SUPABASE_URL=https://ewmcxlhboucnpawqfyxh.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

2. **检查网络连接**
   - 确保能够访问Supabase服务
   - 检查防火墙设置

3. **重新执行脚本**
   - 如果部分表创建失败，可以重新执行整个脚本
   - Supabase会跳过已存在的表

4. **联系支持**
   - 如果问题持续存在，请检查Supabase项目状态
   - 查看Supabase控制台的错误日志

## 注意事项

- 执行SQL脚本前请确保您有项目的管理员权限
- 建议在测试环境先验证脚本的正确性
- 生产环境请确保数据备份
- 定期检查数据库性能和存储使用情况

## 相关文件

- `supabase-schema.sql` - 数据库表结构脚本
- `src/services/supabase.ts` - Supabase服务配置
- `src/types/supabase.ts` - TypeScript类型定义
- `SUPABASE_CONFIG.md` - Supabase配置说明
