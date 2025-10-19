import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: () => import('../views/AuthCallback.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/poem/:id',
      name: 'poem-detail',
      component: () => import('../views/PoemDetail.vue'),
      props: true,
    },
    {
      path: '/category/:name',
      name: 'category',
      component: () => import('../views/CategoryList.vue'),
      props: true,
    },
    {
      path: '/poet/:name',
      name: 'poet',
      component: () => import('../views/PoetDetail.vue'),
      props: true,
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchResults.vue'),
    },
    {
      path: '/collections',
      name: 'collections',
      component: () => import('../views/Collections.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile.vue'),
    },
    {
      path: '/settings/password',
      name: 'change-password',
      component: () => import('../views/ChangePassword.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/community',
      name: 'community',
      component: () => import('../views/Community.vue'),
    },
    {
      path: '/n8n-test',
      name: 'n8n-test',
      component: () => import('../views/N8nTestView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
    },
  ],
})

export default router

// 路由守卫：邮箱未验证则限制访问需要登录的页面
router.beforeEach((to) => {
  const auth = useAuthStore()
  const needAuth = ['/collections', '/profile'].includes(to.path)
  if (!needAuth) return true
  if (!auth.user) return { name: 'login', query: { redirect: to.fullPath } }
  if (!auth.user.email_confirmed_at) {
    return { name: 'login', query: { needVerify: '1' } }
  }
  return true
})
