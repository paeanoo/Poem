# 星汉诗词平台 - 部署指南

## 🚨 部署问题诊断

### 问题1：图片不显示
**原因**：图片文件未正确上传到服务器
**解决**：确保以下文件上传到服务器
```
public/images/categories/
├── tang-poetry.png
├── song-ci.png
└── yuan-qu.png
```

### 问题2：唐诗宋词元曲点击无数据
**原因**：数据库连接失败或数据未导入
**解决**：配置环境变量并导入数据

## 🔧 环境变量配置

### 1. 创建 `.env` 文件
```env
# Supabase 数据库配置
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# n8n 工作流配置
VITE_N8N_WEBHOOK_URL=https://paean.app.n8n.cloud/webhook/poetry-analysis
VITE_N8N_API_KEY=your-api-key

# 应用配置
VITE_APP_TITLE=星汉诗词赏析平台
VITE_APP_DESCRIPTION=基于Vue 3构建的智能诗词赏析平台
```

### 2. 数据库设置
1. **创建Supabase项目**
2. **执行数据库脚本**：
   ```sql
   -- 执行 poetry-database-schema.sql
   -- 执行 migrate-poems-data.sql
   ```

## 📦 部署步骤

### 1. 构建项目
```bash
npm run build
```

### 2. 上传文件
确保以下文件上传到服务器：
- `dist/` 目录（构建后的文件）
- `public/images/categories/` 目录（图片文件）

### 3. 配置服务器
- 设置环境变量
- 配置数据库连接
- 确保静态文件正确服务

## 🔍 故障排除

### 检查1：图片路径
确保图片文件在正确位置：
```
your-domain.com/images/categories/tang-poetry.png
your-domain.com/images/categories/song-ci.png
your-domain.com/images/categories/yuan-qu.png
```

### 检查2：数据库连接
在浏览器控制台查看：
- 是否有Supabase连接错误
- 是否有环境变量缺失错误

### 检查3：数据导入
执行以下SQL验证数据：
```sql
SELECT COUNT(*) FROM poems;
SELECT COUNT(*) FROM poets;
SELECT COUNT(*) FROM dynasties;
```

## 🚀 快速修复

### 临时解决方案（使用本地数据）
如果数据库连接有问题，可以临时修改代码强制使用本地数据：

```typescript
// 在 src/services/poetry.ts 中
export async function getPoems(params?: SearchParams): Promise<Poem[]> {
  // 临时强制使用本地数据
  console.warn('使用本地备用数据（部署模式）')
  return await fetchLocal()
}
```

### 永久解决方案
1. 配置正确的Supabase环境变量
2. 导入完整的数据库数据
3. 确保图片文件正确上传

## 📞 技术支持

如果问题仍然存在，请检查：
1. 浏览器控制台错误信息
2. 网络请求状态
3. 服务器日志
4. 数据库连接状态
