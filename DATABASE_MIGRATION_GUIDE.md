# 星汉诗词平台 - 数据库迁移指南

## 📋 概述

本指南将帮助您将星汉诗词平台从前端硬编码的诗词数据迁移到PostgreSQL数据库，实现真正的后端数据管理。

## 🎯 迁移目标

- ✅ 将前端硬编码的诗词数据迁移到数据库
- ✅ 建立完整的诗词、诗人、朝代数据表结构
- ✅ 实现数据库驱动的诗词搜索和展示
- ✅ 保持现有功能的完整性和用户体验

## 📁 文件说明

### 1. 数据库表结构文件
- `poetry-database-schema.sql` - 完整的PostgreSQL建表SQL语句
- `migrate-poems-data.sql` - 数据迁移脚本，将前端数据导入数据库

### 2. 前端服务更新
- `src/services/poetry.ts` - 更新后的诗词服务层，支持数据库查询
- `src/types/supabase.ts` - 更新后的TypeScript类型定义

### 3. 测试文件
- `test-database-integration.js` - 数据库集成测试脚本

## 🚀 执行步骤

### 第一步：创建数据库表结构

1. **登录Supabase控制台**
   - 访问 [Supabase控制台](https://supabase.com/dashboard)
   - 选择您的项目

2. **执行建表SQL**
   - 进入SQL编辑器
   - 复制并执行 `poetry-database-schema.sql` 文件内容
   - 等待表创建完成

3. **验证表创建**
   ```sql
   -- 检查表是否创建成功
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('dynasties', 'poets', 'poems', 'poem_analyses');
   ```

### 第二步：迁移诗词数据

1. **执行数据迁移**
   - 在SQL编辑器中执行 `migrate-poems-data.sql` 文件内容
   - 等待数据插入完成

2. **验证数据迁移**
   ```sql
   -- 检查数据是否迁移成功
   SELECT 
     (SELECT COUNT(*) FROM dynasties) as dynasty_count,
     (SELECT COUNT(*) FROM poets) as poet_count,
     (SELECT COUNT(*) FROM poems) as poem_count;
   ```

### 第三步：更新前端代码

1. **更新服务层**
   - 前端服务层已更新为优先从数据库获取数据
   - 支持降级到远程API和本地数据

2. **测试功能**
   - 启动开发服务器：`npm run dev`
   - 访问首页，检查诗词数据是否正确加载
   - 测试搜索功能是否正常工作

### 第四步：验证集成

1. **运行测试脚本**
   ```bash
   node test-database-integration.js
   ```

2. **检查功能**
   - ✅ 诗词列表正常显示
   - ✅ 搜索功能正常工作
   - ✅ 诗词详情页面正常加载
   - ✅ 点赞、收藏功能正常

## 📊 数据库表结构

### 核心表

| 表名 | 说明 | 主要字段 |
|------|------|----------|
| `dynasties` | 朝代表 | id, name, start_year, end_year, description |
| `poets` | 诗人表 | id, name, dynasty_id, birth_year, death_year, biography |
| `poems` | 诗词表 | id, title, author_id, content, tags, popularity_score |
| `poem_analyses` | 诗词赏析表 | id, poem_id, type, background, theme, appreciation |
| `poem_tags` | 诗词标签表 | id, name, description, color |
| `poem_tag_relations` | 诗词标签关联表 | id, poem_id, tag_id |

### 功能表

| 表名 | 说明 | 主要字段 |
|------|------|----------|
| `user_collections` | 用户收藏表 | id, user_id, poem_id, poem_data |
| `poem_likes` | 诗词点赞表 | id, user_id, poem_id |
| `poem_comments` | 诗词评论表 | id, poem_id, user_id, content |
| `study_records` | 学习记录表 | id, user_id, poem_id, action, progress |

## 🔍 功能特性

### 1. 智能搜索
- 支持标题和内容全文搜索
- 支持按作者、朝代筛选
- 支持标签搜索

### 2. 数据统计
- 诗词热度评分
- 浏览量和点赞数统计
- 学习进度跟踪

### 3. 扩展性
- 支持添加新诗词
- 支持自定义标签
- 支持多级赏析内容

## 🛠️ 开发建议

### 1. 数据管理
- 定期备份数据库
- 监控数据库性能
- 优化查询索引

### 2. 功能扩展
- 可以添加更多诗词数据
- 可以扩展赏析内容
- 可以添加用户学习分析

### 3. 性能优化
- 使用数据库连接池
- 实现数据缓存
- 优化查询语句

## 🐛 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查Supabase配置
   - 验证网络连接
   - 确认权限设置

2. **数据查询失败**
   - 检查表结构是否正确
   - 验证数据是否迁移成功
   - 查看错误日志

3. **前端显示异常**
   - 检查服务层代码
   - 验证数据类型转换
   - 测试降级机制

### 调试方法

1. **查看控制台日志**
   ```javascript
   // 在浏览器控制台查看详细错误信息
   console.log('数据库查询结果:', data)
   ```

2. **检查网络请求**
   - 打开浏览器开发者工具
   - 查看Network标签页
   - 检查API请求状态

3. **验证数据库状态**
   ```sql
   -- 检查表是否存在
   SELECT * FROM information_schema.tables WHERE table_name = 'poems';
   
   -- 检查数据是否存在
   SELECT COUNT(*) FROM poems;
   ```

## 📈 后续优化

### 1. 数据扩展
- 添加更多诗词数据
- 完善诗人信息
- 丰富赏析内容

### 2. 功能增强
- 实现智能推荐
- 添加学习分析
- 支持用户创作

### 3. 性能提升
- 实现数据缓存
- 优化查询性能
- 添加CDN支持

## 📞 技术支持

如果在迁移过程中遇到问题，请：

1. 查看控制台错误信息
2. 检查数据库连接状态
3. 验证SQL语句执行结果
4. 参考本文档的故障排除部分

---

**注意**: 执行数据库迁移前，请确保已备份现有数据，避免数据丢失。

**成功迁移后，您的星汉诗词平台将拥有完整的后端数据支持，为后续功能扩展奠定坚实基础！** 🎉
