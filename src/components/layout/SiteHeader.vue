<template>
  <header class="site-header">
    <nav class="nav">
      <div class="nav-left">
        <RouterLink class="logo" to="/">星汉诗词</RouterLink>
        <div class="main-nav">
          <RouterLink to="/">首页</RouterLink>
          <RouterLink to="/search">搜索</RouterLink>
          <RouterLink to="/collections">收藏</RouterLink>
          <RouterLink to="/community">社区</RouterLink>
          <RouterLink to="/about">关于</RouterLink>
        </div>
      </div>
      <div class="nav-right">
        <div class="search-container">
          <input
            type="text"
            placeholder="搜索诗词、作者..."
            class="search-input"
            @keyup.enter="onSearchEnter"
          />
          <i class="fas fa-search search-icon"></i>
        </div>
        <div class="user-nav">
          <RouterLink v-if="user" to="/profile" class="user-link">我的</RouterLink>
          <RouterLink v-if="user" to="/settings/password" class="user-link">修改密码</RouterLink>
          <RouterLink v-if="!user" to="/login" class="user-link">登录</RouterLink>
          <button v-else type="button" class="logout-btn" @click="onSignOut" :disabled="loading">退出</button>
        </div>
      </div>
    </nav>
  </header>
  <div class="nav-spacer" />
  <!-- 占位以避免固定头部遮挡内容 -->
</template>

<script setup lang="ts" name="SiteHeader">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const { user, loading } = storeToRefs(auth)
const router = useRouter()

const onSearchEnter = (e: KeyboardEvent) => {
  const target = e.target as HTMLInputElement
  const q = target.value.trim()
  if (!q) return
  router.push({ name: 'search', query: { q } })
}

const onSignOut = async () => {
  try {
    const { error } = await auth.signOut()
    if (error) {
      // 轻量提示；也可替换为全局消息组件
      console.error('退出失败：', error.message)
    }
  } finally {
    // 无论成功失败，先导航到登录页
    router.push('/login').finally(() => {
      // 兜底：若状态未正确重置，强制刷新确保前端清洁态
      setTimeout(() => {
        if (auth.user) {
          window.location.reload()
        }
      }, 50)
    })
  }
}
</script>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  display: flex;
  align-items: center;
  background: #000000;
  color: #fff;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.nav {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}
.nav-left {
  display: flex;
  align-items: center;
  gap: 32px;
}
.logo {
  font-weight: 700;
  color: #e6edf3;
  text-decoration: none;
  font-size: 1.5rem;
}
.main-nav {
  display: flex;
  gap: 24px;
}
.main-nav a {
  color: #c9d1d9;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}
.main-nav a:hover {
  color: #58a6ff;
}
.main-nav a.router-link-active {
  color: #58a6ff;
}
.nav-right {
  display: flex;
  align-items: center;
  gap: 24px;
}
.search-container {
  position: relative;
}
.search-input {
  background: #1a1a1a;
  border: 1px solid #333;
  color: #fff;
  border-radius: 24px;
  padding: 8px 16px 8px 40px;
  width: 280px;
  font-size: 14px;
  transition: all 0.2s;
}
.search-input:focus {
  outline: none;
  border-color: #58a6ff;
  box-shadow: 0 0 0 2px rgba(88, 166, 255, 0.2);
}
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 14px;
}
.user-nav {
  display: flex;
  align-items: center;
  gap: 16px;
}
.user-link {
  color: #c9d1d9;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}
.user-link:hover {
  color: #58a6ff;
}
.logout-btn {
  background: transparent;
  border: none;
  color: #c9d1d9;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.2s;
}
.logout-btn:hover {
  color: #58a6ff;
}
.logout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.nav-spacer {
  height: 64px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav {
    padding: 0 16px;
  }
  .nav-left {
    gap: 16px;
  }
  .main-nav {
    gap: 16px;
  }
  .search-input {
    width: 200px;
  }
  .nav-right {
    gap: 16px;
  }
}

@media (max-width: 640px) {
  .main-nav {
    display: none;
  }
  .search-input {
    width: 150px;
  }
}
</style>

