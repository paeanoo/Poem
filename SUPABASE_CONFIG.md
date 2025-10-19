# Supabase 配置说明

## 配置概述

本项目已成功配置Supabase作为后端服务，提供用户认证、数据存储和社区功能。

## Supabase 项目信息

- **项目URL**: https://ewmcxlhboucnpawqfyxh.supabase.co
- **控制台地址**: https://supabase.com/dashboard/project/ewmcxlhboucnpawqfyxh
- **API文档**: https://ewmcxlhboucnpawqfyxh.supabase.co/rest/v1/

## 环境变量配置

在 `.env` 文件中配置了以下环境变量：

```env
VITE_SUPABASE_URL=https://ewmcxlhboucnpawqfyxh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3bWN4bGhib3VjbnBhd3FmeXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0Njg1ODAsImV4cCI6MjA3NjA0NDU4MH0.SRexDgy60uyE2pHD57D5AdXFrpm9TdXAGsaIaXOeedk
```

## 服务模块

### 1. 核心服务 (`src/services/supabase.ts`)

- **supabase**: Supabase客户端实例
- **auth**: 用户认证相关方法
- **collections**: 诗词收藏功能
- **community**: 社区评论功能
- **profiles**: 用户资料管理

### 2. 类型定义 (`src/types/supabase.ts`)

定义了完整的TypeScript类型，包括：
- 数据库表结构
- 用户认证类型
- 收藏和评论类型

## 功能模块

### 用户认证
```typescript
import { auth } from '@/services/supabase'

// 用户登录
await auth.signIn(email, password)

// 用户注册
await auth.signUp(email, password)

// 获取当前用户
await auth.getCurrentUser()
```

### 诗词收藏
```typescript
import { collections } from '@/services/supabase'

// 添加收藏
await collections.addToCollection(userId, poemId, poemData)

// 获取用户收藏
await collections.getUserCollections(userId)

// 检查是否已收藏
await collections.isPoemCollected(userId, poemId)
```

### 社区评论
```typescript
import { community } from '@/services/supabase'

// 获取诗词评论
await community.getPoemComments(poemId)

// 添加评论
await community.addComment(poemId, userId, content)
```

### 用户资料
```typescript
import { profiles } from '@/services/supabase'

// 获取用户资料
await profiles.getUserProfile(userId)

// 更新用户资料
await profiles.updateUserProfile(userId, updates)
```

## 数据库表结构

### user_profiles (用户资料表)
- `id`: 用户ID (与auth.users关联)
- `username`: 用户名
- `email`: 邮箱
- `avatar`: 头像URL
- `bio`: 个人简介
- `created_at`: 创建时间
- `updated_at`: 更新时间

### user_collections (用户收藏表)
- `id`: 收藏ID
- `user_id`: 用户ID
- `poem_id`: 诗词ID
- `poem_data`: 诗词数据 (JSON格式)
- `created_at`: 收藏时间
- `updated_at`: 更新时间

### poem_comments (诗词评论表)
- `id`: 评论ID
- `poem_id`: 诗词ID
- `user_id`: 用户ID
- `content`: 评论内容
- `created_at`: 评论时间
- `updated_at`: 更新时间

## 使用示例

查看 `src/services/supabase-example.ts` 文件了解完整的使用示例。

## 开发说明

1. 确保环境变量已正确配置
2. 在Supabase控制台创建相应的数据库表
3. 根据需要设置行级安全策略 (RLS)
4. 测试各功能模块是否正常工作

## 注意事项

- 生产环境请确保启用行级安全策略
- 敏感操作需要适当的权限验证
- 定期备份重要数据
- 监控API使用量和性能指标