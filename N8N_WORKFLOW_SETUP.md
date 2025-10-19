# n8n工作流配置指南

本文档介绍如何为星汉诗词赏析平台配置n8n工作流，实现AI聊天助手功能。

## 📋 概述

AI聊天助手基于n8n工作流实现，通过webhook接收用户消息，处理后返回AI回复。工作流支持：
- 诗词相关问答
- 诗人背景介绍
- 诗词创作建议
- 智能推荐功能

## 🔧 环境配置

### 1. 环境变量设置

在项目根目录创建 `.env` 文件：

```env
# n8n工作流配置
VITE_N8N_WEBHOOK_URL=https://paean.app.n8n.cloud/webhook/poetry-analysis
VITE_N8N_API_KEY=your-api-key-here

# 其他配置
VITE_APP_TITLE=星汉诗词赏析平台
VITE_APP_DESCRIPTION=基于Vue 3构建的智能诗词赏析平台
```

**注意**: 如果未设置环境变量，系统将自动使用默认的n8n工作流地址：`https://paean.app.n8n.cloud/webhook/poetry-analysis`

### 2. 配置说明

- `VITE_N8N_WEBHOOK_URL`: n8n工作流的webhook地址
- `VITE_N8N_API_KEY`: 可选的API认证密钥
- 其他配置项可根据需要添加

## 🚀 n8n工作流设计

### 工作流结构

```
Webhook触发器 → 消息预处理 → AI处理 → 响应格式化 → 返回结果
```

### 详细步骤

#### 1. Webhook触发器
- **节点类型**: Webhook
- **HTTP方法**: POST
- **路径**: `/webhook/poetry-ai`
- **认证**: 可选（Bearer Token）

#### 2. 消息预处理
- **节点类型**: Code/Function
- **功能**: 
  - 验证请求格式
  - 提取用户消息
  - 添加上下文信息
  - 错误处理

#### 3. AI处理
- **节点类型**: HTTP Request 或 AI节点
- **目标**: 调用AI服务（OpenAI、Claude等）
- **功能**:
  - 构建提示词
  - 发送AI请求
  - 处理AI响应

#### 4. 响应格式化
- **节点类型**: Code/Function
- **功能**:
  - 格式化AI回复
  - 添加元数据
  - 错误处理

#### 5. 返回结果
- **节点类型**: Respond to Webhook
- **功能**: 返回JSON格式响应

## 📝 请求/响应格式

### 请求格式

```json
{
  "message": "用户消息内容",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "context": {
    "platform": "poetry-app",
    "version": "1.0.0",
    "userId": "optional-user-id",
    "sessionId": "optional-session-id"
  },
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "language": "zh-CN",
    "timezone": "Asia/Shanghai"
  }
}
```

### 响应格式

```json
{
  "success": true,
  "data": {
    "message": "AI回复内容",
    "confidence": 0.95,
    "suggestions": ["相关建议1", "相关建议2"],
    "relatedPoems": [
      {
        "title": "诗词标题",
        "author": "作者",
        "excerpt": "诗词片段",
        "id": "诗词ID"
      }
    ]
  },
  "metadata": {
    "processingTime": 1500,
    "model": "gpt-3.5-turbo",
    "version": "1.0.0"
  }
}
```

### 错误响应格式

```json
{
  "success": false,
  "error": "错误描述",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🤖 AI提示词模板

### 基础提示词

```
你是一位专业的诗词AI助手，专门帮助用户理解和欣赏中国古典诗词。请根据用户的问题提供准确、有深度的回答。

用户问题：{user_message}

请用中文回答，回答应该：
1. 准确专业，体现诗词的文学价值
2. 语言优美，符合诗词赏析的语境
3. 适当引用相关诗词作品
4. 提供实用的学习建议

如果用户询问具体诗词，请提供：
- 诗词背景和创作背景
- 文学手法和艺术特色
- 意境分析和情感表达
- 相关诗词推荐
```

### 特殊场景提示词

#### 诗词推荐
```
用户想要诗词推荐，请根据以下信息推荐合适的诗词：
- 用户偏好：{preferences}
- 当前心情：{mood}
- 学习目标：{goals}

请推荐3-5首诗词，每首包含：
- 诗词标题和作者
- 简要介绍
- 推荐理由
```

#### 创作指导
```
用户想要学习诗词创作，请提供：
1. 基础格律知识
2. 常用修辞手法
3. 意境营造技巧
4. 实践练习建议
```

## 🔍 测试和调试

### 1. 连接测试

使用以下命令测试n8n连接：

```bash
curl -X POST https://your-n8n-instance.com/webhook/poetry-ai \
  -H "Content-Type: application/json" \
  -d '{
    "message": "测试连接",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "context": {
      "platform": "poetry-app",
      "version": "1.0.0"
    }
  }'
```

### 2. 功能测试

测试不同类型的用户输入：

```json
// 诗词查询
{
  "message": "推荐一首李白的诗",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "context": {
    "platform": "poetry-app",
    "version": "1.0.0"
  }
}

// 创作指导
{
  "message": "如何写一首七言绝句？",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "context": {
    "platform": "poetry-app",
    "version": "1.0.0"
  }
}
```

## 📊 监控和日志

### 1. 日志记录

在工作流中添加日志节点，记录：
- 请求时间
- 用户消息
- 处理时间
- 响应内容
- 错误信息

### 2. 性能监控

监控指标：
- 响应时间
- 成功率
- 错误率
- 并发处理能力

### 3. 错误处理

实现完善的错误处理：
- 网络超时
- AI服务不可用
- 无效请求
- 系统错误

## 🚀 部署建议

### 1. 生产环境

- 使用HTTPS
- 配置适当的超时时间
- 实现请求限流
- 添加监控告警

### 2. 安全考虑

- API密钥管理
- 请求验证
- 防止滥用
- 数据隐私保护

## 📚 相关资源

- [n8n官方文档](https://docs.n8n.io/)
- [Vue 3官方文档](https://vuejs.org/)
- [TypeScript文档](https://www.typescriptlang.org/)
- [诗词数据库API](https://api.jinrishici.com/)

## 🤝 技术支持

如有问题，请参考：
1. 检查环境变量配置
2. 验证n8n工作流状态
3. 查看浏览器控制台错误
4. 检查网络连接状态

---

*让AI技术为诗词文化传承注入新的活力* ✨
