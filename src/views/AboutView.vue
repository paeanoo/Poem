<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- 页面头部 -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">关于星汉诗词</h1>
      <p class="text-xl text-gray-600">传承千年文化，品味诗词之美</p>
    </div>

    <!-- 项目介绍 -->
    <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">项目介绍</h2>
      <div class="prose max-w-none">
        <p class="text-gray-700 leading-relaxed mb-4">
          星汉诗词是一个专注于中华古典诗词的在线平台，致力于为诗词爱好者提供优质的诗词阅读、学习和交流体验。
          我们汇聚了从先秦到现代的经典诗词作品，通过现代化的技术手段，让古老的诗词文化焕发新的生机。
        </p>
        <p class="text-gray-700 leading-relaxed">
          平台采用Vue 3 + TypeScript + Supabase技术栈构建，具有响应式设计、实时数据同步、用户认证等现代化功能，
          为用户提供流畅、安全、便捷的诗词学习环境。
        </p>
      </div>
    </div>

    <!-- 功能特色 -->
    <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">功能特色</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-book text-2xl text-amber-600"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">海量诗词库</h3>
          <p class="text-gray-600 text-sm">收录数万首经典诗词，涵盖各个朝代和流派</p>
        </div>
        <div class="text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-search text-2xl text-blue-600"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">智能搜索</h3>
          <p class="text-gray-600 text-sm">支持按标题、作者、朝代、内容等多维度搜索</p>
        </div>
        <div class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-heart text-2xl text-green-600"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">个人收藏</h3>
          <p class="text-gray-600 text-sm">收藏喜爱的诗词，建立个人诗词库</p>
        </div>
        <div class="text-center">
          <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-comments text-2xl text-purple-600"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">社区交流</h3>
          <p class="text-gray-600 text-sm">与诗词爱好者交流心得，分享创作</p>
        </div>
        <div class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-lightbulb text-2xl text-red-600"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">深度赏析</h3>
          <p class="text-gray-600 text-sm">提供多层次的诗词赏析和解读</p>
        </div>
        <div class="text-center">
          <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-mobile-alt text-2xl text-indigo-600"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">响应式设计</h3>
          <p class="text-gray-600 text-sm">完美适配各种设备，随时随地阅读诗词</p>
        </div>
      </div>
    </div>

    <!-- 技术栈 -->
    <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">技术栈</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <div class="text-2xl font-bold text-green-600 mb-1">Vue 3</div>
          <div class="text-sm text-gray-600">前端框架</div>
        </div>
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <div class="text-2xl font-bold text-blue-600 mb-1">TypeScript</div>
          <div class="text-sm text-gray-600">类型安全</div>
        </div>
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <div class="text-2xl font-bold text-purple-600 mb-1">Supabase</div>
          <div class="text-sm text-gray-600">后端服务</div>
        </div>
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <div class="text-2xl font-bold text-cyan-600 mb-1">Tailwind</div>
          <div class="text-sm text-gray-600">样式框架</div>
        </div>
      </div>
    </div>

    <!-- 开发团队 -->
    <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">开发团队</h2>
      <div class="text-center">
        <div class="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-user text-3xl text-white"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">AI进化论-花生</h3>
        <p class="text-gray-600 mb-4">全栈开发工程师</p>
        <p class="text-gray-700 max-w-md mx-auto">
          专注于Vue.js和现代Web技术，致力于用技术传承和弘扬中华优秀传统文化。
          拥有丰富的全栈开发经验，擅长构建用户友好的Web应用程序。
        </p>
      </div>
    </div>

    <!-- 联系我们 -->
    <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">联系我们</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-3">项目信息</h3>
          <ul class="space-y-2 text-gray-600">
            <li><i class="fas fa-code mr-2 text-amber-600"></i>开源项目</li>
            <li><i class="fas fa-calendar mr-2 text-amber-600"></i>创建时间：2024年</li>
            <li><i class="fas fa-globe mr-2 text-amber-600"></i>技术栈：Vue 3 + TypeScript</li>
            <li><i class="fas fa-database mr-2 text-amber-600"></i>数据库：Supabase</li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-3">反馈建议</h3>
          <p class="text-gray-600 mb-4">
            如果您在使用过程中遇到问题或有任何建议，欢迎通过以下方式联系我们：
          </p>
          <div class="space-y-2">
            <button class="flex items-center text-amber-600 hover:text-amber-700 transition-colors">
              <i class="fas fa-envelope mr-2"></i>
              发送邮件反馈
            </button>
            <button class="flex items-center text-amber-600 hover:text-amber-700 transition-colors">
              <i class="fab fa-github mr-2"></i>
              GitHub Issues
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 版权信息 -->
    <div class="text-center text-gray-500 text-sm">
      <p>&copy; 2024 星汉诗词. 传承千年文化，品味诗词之美.</p>
      <p class="mt-2">本项目仅供学习交流使用，诗词内容来源于公开资料</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 关于页面组件
</script>

<style scoped>
.prose {
  line-height: 1.7;
}
</style>
