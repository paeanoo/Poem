# 星汉诗词赏析平台 (Starry Poetry Platform)

一个基于Vue 3 + TypeScript构建的智能诗词赏析平台，旨在通过现代化的Web技术为诗词爱好者提供沉浸式的学习和赏析体验。

## 🌟 项目愿景

构建一个以诗词爱好者为中心、AI赋能的智慧赏析平台，通过深度整合AI智能体与传统文化知识，为诗词爱好者提供沉浸式赏析体验，为诗词研究者提供专业分析工具，为教育工作者提供教学辅助资源，最终实现诗词文化的现代化传播与智能化传承。

## 🚀 核心功能

### 1. 智能赏析模块
- 多维度自动解析（字词、句式、意境、情感）
- 对比赏析（同一作者不同时期、同一题材不同作者）
- 文化背景深度解读（历史事件、哲学思想、艺术流派）

### 2. 知识图谱探索
- 诗人关系网络（师承、友谊、影响）
- 题材演变脉络（不同朝代的题材发展）
- 意象传承分析（同一意象在不同诗词中的运用）

### 3. 互动学习功能
- 智能背诵检测（语音识别评估背诵准确性）
- 理解度测试（选择题、填空题、问答题）
- 创作训练营（从对仗练习到完整创作）

### 4. 社区交流平台
- 专家答疑区（定期邀请诗词专家在线交流）
- 作品分享区（用户原创作品展示与交流）
- 读书会活动（线上诗词沙龙和讨论组）

### 5. 用户互动功能
- **点赞系统**: 支持对诗词进行点赞，实时显示点赞数量（仅在详情页面）
- **收藏功能**: 用户可以收藏喜爱的诗词，建立个人诗词库（仅在详情页面）
- **分享功能**: 支持分享诗词到社交媒体或复制链接（仅在详情页面）
- **搜索功能**: 智能搜索诗词、作者，支持高级筛选
- **社区功能**: 讨论话题、用户创作、热门内容展示
- **AI聊天助手**: 完全基于n8n工作流的智能AI助手，无本地备用机制，提供诗词问答、创作指导、智能推荐等功能

### 6. 交互设计理念
- **简洁列表**: 首页和搜索页面保持简洁，专注于内容展示
- **详情互动**: 点赞、收藏、分享等功能仅在诗词详情页面提供
- **渐进式交互**: 用户需要点击进入详情页面后才能进行深度互动

## 🛠️ 技术栈

- **前端框架**: Vue 3 (Composition API)
- **语言**: TypeScript
- **构建工具**: Vite
- **路由管理**: Vue Router 4
- **状态管理**: Pinia
- **后端服务**: Supabase
- **样式框架**: Tailwind CSS
- **代码规范**: ESLint

## 📦 核心组件

### PoemActions 组件
- **位置**: `src/components/poem/PoemActions.vue`
- **功能**: 统一的诗词操作组件，包含点赞、收藏、分享功能
- **特性**: 
  - 实时状态同步
  - 用户认证检查
  - 响应式设计
  - 错误处理

### 页面组件
- **首页**: `src/views/HomeView.vue` - 展示热门诗词、分类、名家作品，集成AI聊天助手
- **诗词详情**: `src/views/PoemDetail.vue` - 完整的诗词展示和赏析
- **搜索结果**: `src/views/SearchResults.vue` - 智能搜索和筛选
- **社区**: `src/views/Community.vue` - 讨论话题和用户创作
- **收藏**: `src/views/Collections.vue` - 个人收藏管理
- **关于**: `src/views/AboutView.vue` - 项目介绍和团队信息

### AI聊天助手组件
- **位置**: `src/components/chat/AiChatAssistant.vue`
- **功能**: 完全基于n8n工作流的智能AI助手
- **特性**: 
  - 悬浮式聊天界面
  - 实时消息交互
  - 聊天历史保存
  - 快捷问题推荐
  - 响应式设计
  - 动画效果优化
  - 完全依赖n8n工作流，无本地备用机制

## 🎨 头像系统

项目实现了智能头像显示系统，包含以下特性：

### 本地头像资源
- 使用著名诗人（李白、杜甫、苏轼）的历史画像
- 基于传统中国人物画风格的真实肖像
- 体现诗人的历史形象和文化内涵
- 存储路径：`public/images/poets/`

### 智能备用方案
- 当头像加载失败时，自动生成文字头像
- 根据作者姓名智能分配颜色主题
- 支持中英文名称的首字母显示
- 工具函数：`src/utils/avatarUtils.ts`

### 应用范围
- 首页名家作品展示
- 社区用户创作展示
- 所有用户头像显示

### 历史说明
- 使用传统中国人物画风格的历史画像
- 基于历史文献和传统绘画的真实肖像
- 体现诗人的历史形象和文化传承
- 尊重历史，展现真实的诗人形象

## 📁 项目结构

```
poem-app/
├── public/              # 静态资源
├── src/
│   ├── assets/         # 样式和图片资源
│   ├── components/     # 可复用组件
│   │   ├── common/     # 通用组件
│   │   ├── poem/       # 诗词相关组件
│   │   └── layout/     # 布局组件
│   ├── views/          # 页面组件
│   │   ├── Home.vue    # 首页探索
│   │   ├── PoemDetail.vue # 诗词详情页
│   │   ├── Search.vue  # 搜索页面
│   │   └── Profile.vue # 个人学习中心
│   ├── stores/         # Pinia状态管理
│   │   ├── poem.ts     # 诗词数据状态
│   │   ├── user.ts     # 用户状态
│   │   └── ai.ts       # AI服务状态
│   ├── router/         # 路由配置
│   ├── types/          # TypeScript类型定义
│   ├── utils/          # 工具函数
│   ├── services/       # API服务
│   └── main.ts         # 应用入口
├── package.json
└── README.md
```

## 🎨 设计理念

### 设计原则
1. **文化韵味**: 界面设计融入中国传统美学元素
2. **分层体验**: 为初学者、爱好者、专家提供不同深度的界面
3. **沉浸阅读**: 优化诗词阅读的视觉体验和情感共鸣
4. **智能交互**: AI功能自然融入用户体验流程
5. **社交融合**: 社区功能与学习功能有机结合

## 🔧 开发环境

### 推荐IDE配置
- [VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

### 推荐浏览器配置
- Chrome/Edge: [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- Firefox: [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

## 📦 安装和运行

### 环境要求
- Node.js: ^20.19.0 || >=22.12.0
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 开发环境运行
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 代码检查和修复
```bash
npm run lint
```

### 类型检查
```bash
npm run type-check
```

## 🎯 开发规范

### Vue 3 最佳实践
- 使用Composition API和setup语法糖
- 合理使用响应式API (ref, reactive, computed等)
- 组件化开发，确保可复用性和可维护性
- 实现响应式设计，支持多端适配

### TypeScript规范
- 严格的类型检查
- 定义清晰的接口和类型
- 使用泛型提高代码复用性

### 代码风格
- 遵循ESLint配置规范
- 编写详细的代码注释
- 合理的错误处理和日志记录

## 🗺️ 开发路线图

### 阶段一：基础平台搭建（3个月）
- [x] 项目初始化和基础架构
- [x] 诗词数据模型设计
- [x] 基础UI组件库
- [x] 核心页面开发
- [x] 作者头像显示优化

### 阶段二：AI能力集成（4个月）
- [ ] AI智能体接口对接
- [ ] 智能推荐系统
- [ ] 互动学习功能

### 阶段三：社区生态建设（5个月）
- [ ] 社区功能开发
- [ ] 用户系统完善
- [ ] 移动端优化

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤖 AI聊天助手配置

### n8n工作流设置

AI聊天助手完全基于n8n工作流实现，已配置使用以下webhook地址：

**当前配置的n8n工作流地址**: `https://paean.app.n8n.cloud/webhook/poetry-analysis`

### 配置说明

1. **完全依赖n8n工作流**
   - 系统已自动配置使用指定的n8n工作流地址
   - 无需额外环境变量设置
   - 支持自动重试和错误处理
   - 无本地备用机制，完全依赖远程n8n工作流

2. **功能特性**
   - 诗词相关问答
   - 诗人背景介绍
   - 创作技巧指导
   - 智能推荐功能
   - 聊天历史保存
   - 完全依赖远程n8n工作流（无本地备用回复）

3. **测试连接**
   ```typescript
   import { testN8nConnection } from '@/services/n8n';
   
   // 测试n8n连接
   const result = await testN8nConnection();
   console.log(result);
   ```

4. **错误处理**
   - 当n8n工作流不可用时，系统会显示相应的错误信息
   - 不会使用任何本地备用回复
   - 所有AI功能完全依赖n8n工作流的响应

## 🗄️ 数据库设置

### 首次运行设置

如果遇到收藏功能加载失败的错误，需要先设置数据库表结构：

1. **打开Supabase控制台**
   - 访问 [Supabase控制台](https://supabase.com/dashboard)
   - 选择项目：`ewmcxlhboucnpawqfyxh`

2. **执行SQL脚本**
   - 进入SQL编辑器
   - 执行项目根目录下的 `supabase-schema.sql` 文件
   - 等待表创建完成

3. **验证功能**
   - 刷新收藏页面
   - 测试点赞、收藏功能

详细步骤请参考 `DATABASE_SETUP.md` 文件。

## 📞 联系方式

- 项目维护者: AI助手
- 邮箱: [项目邮箱]
- 项目链接: [GitHub仓库地址]

---

*让诗词文化在现代科技中焕发新的生命力* ✨