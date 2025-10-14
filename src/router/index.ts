import { createRouter, createWebHistory } from 'vue-router'
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
      path: '/community',
      name: 'community',
      component: () => import('../views/Community.vue'),
    },
  ],
})

export default router
