<script setup lang="ts" name="UserProfile">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { profiles, collections } from '@/services/supabase'

const auth = useAuthStore()

const loading = ref(false)
const error = ref<string | null>(null)
const activeTab = ref('overview')

// 用户资料
const profile = ref<{
  id?: string;
  username: string | null;
  email?: string | null;
  avatar: string | null;
  bio: string | null;
  created_at: string;
  updated_at?: string;
} | null>(null)

// 学习统计
const learningStats = ref({
  totalRead: 0,
  totalCollected: 0,
  totalDays: 0,
  favoriteDynasty: '',
  favoriteAuthor: ''
})

// 最近活动
const recentActivities = ref([
  { type: 'read', poem: '静夜思', author: '李白', time: '2小时前' },
  { type: 'collect', poem: '春晓', author: '孟浩然', time: '1天前' },
  { type: 'comment', poem: '水调歌头·明月几时有', author: '苏轼', time: '2天前' }
])

// 我的创作
const myCreations = ref([
  {
    id: '1',
    title: '春日感怀',
    content: '春风拂面花满园，燕子归来柳絮飞。',
    status: 'published',
    likes: 12,
    comments: 3,
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    title: '秋夜思',
    content: '月明星稀夜未央，思绪万千入梦乡。',
    status: 'draft',
    likes: 0,
    comments: 0,
    createdAt: '2024-01-08'
  }
])

// 切换标签页
const switchTab = (tab: string) => {
  activeTab.value = tab
}

// 加载用户资料
const loadProfile = async () => {
  if (!auth.user) return

  loading.value = true
  error.value = null

  try {
    const { data, error: err } = await profiles.getUserProfile(auth.user.id)
    if (err) {
      error.value = err.message
      return
    }
    profile.value = data
  } catch (err) {
    error.value = '加载用户资料失败'
    console.error('加载用户资料失败:', err)
  } finally {
    loading.value = false
  }
}

// 加载学习统计
const loadLearningStats = async () => {
  if (!auth.user) return

  try {
    // 加载收藏数量
    const { data: collectionsData } = await collections.getUserCollections(auth.user.id)
    learningStats.value.totalCollected = collectionsData?.length || 0

    // 模拟其他统计数据
    learningStats.value.totalRead = 25
    learningStats.value.totalDays = 15
    learningStats.value.favoriteDynasty = '唐'
    learningStats.value.favoriteAuthor = '李白'
  } catch (err) {
    console.error('加载学习统计失败:', err)
  }
}

// 编辑资料
const editProfile = () => {
  // 实现编辑资料功能
  console.log('编辑资料')
}


// 发布创作
const publishCreation = (creationId: string) => {
  const creation = myCreations.value.find(c => c.id === creationId)
  if (creation) {
    creation.status = 'published'
  }
}

// 删除创作
const deleteCreation = (creationId: string) => {
  const index = myCreations.value.findIndex(c => c.id === creationId)
  if (index > -1) {
    myCreations.value.splice(index, 1)
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

onMounted(async () => {
  await Promise.all([
    loadProfile(),
    loadLearningStats()
  ])
})
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- 未登录状态 -->
    <div v-if="!auth.user" class="text-center py-12">
      <div class="max-w-md mx-auto">
        <i class="fas fa-user text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">请先登录</h3>
        <p class="text-gray-500 mb-6">登录后可以查看个人资料和学习进度</p>
        <button
          @click="$router.push('/login')"
          class="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          立即登录
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-else-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      <p class="mt-2 text-gray-600">加载中...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="text-center py-12">
      <div class="max-w-md mx-auto">
        <i class="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">加载失败</h3>
        <p class="text-gray-500 mb-6">{{ error }}</p>
        <button
          @click="loadProfile"
          class="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          重新加载
        </button>
      </div>
    </div>

    <!-- 个人中心内容 -->
    <div v-else class="space-y-6">
      <!-- 用户信息卡片 -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center space-x-6">
          <div class="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
            <i class="fas fa-user text-2xl text-white"></i>
          </div>
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-gray-800 mb-1">
              {{ profile?.username || '诗词爱好者' }}
            </h2>
            <p class="text-gray-600 mb-2">{{ profile?.email }}</p>
            <p class="text-gray-500 text-sm">
              加入时间：{{ profile?.created_at ? formatDate(profile.created_at) : '未知' }}
            </p>
          </div>
          <div class="flex space-x-3">
            <button
              @click="editProfile"
              class="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
            >
              <i class="fas fa-edit mr-2"></i>
              编辑资料
            </button>
          </div>
        </div>
        <div v-if="profile?.bio" class="mt-4 pt-4 border-t border-gray-200">
          <p class="text-gray-700">{{ profile.bio }}</p>
        </div>
      </div>

      <!-- 标签页导航 -->
      <div class="bg-white rounded-xl shadow-lg">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6">
            <button
              @click="switchTab('overview')"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'overview'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              ]"
            >
              <i class="fas fa-chart-line mr-2"></i>
              学习概览
            </button>
            <button
              @click="switchTab('activities')"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'activities'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              ]"
            >
              <i class="fas fa-history mr-2"></i>
              最近活动
            </button>
            <button
              @click="switchTab('creations')"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'creations'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              ]"
            >
              <i class="fas fa-pen-fancy mr-2"></i>
              我的创作
            </button>
            <button
              @click="switchTab('settings')"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'settings'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              ]"
            >
              <i class="fas fa-cog mr-2"></i>
              设置
            </button>
          </nav>
        </div>

        <!-- 学习概览标签页 -->
        <div v-if="activeTab === 'overview'" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center">
              <i class="fas fa-book text-3xl text-blue-600 mb-3"></i>
              <h3 class="text-2xl font-bold text-blue-800">{{ learningStats.totalRead }}</h3>
              <p class="text-blue-600">已读诗词</p>
            </div>
            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center">
              <i class="fas fa-heart text-3xl text-green-600 mb-3"></i>
              <h3 class="text-2xl font-bold text-green-800">{{ learningStats.totalCollected }}</h3>
              <p class="text-green-600">收藏诗词</p>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 text-center">
              <i class="fas fa-calendar text-3xl text-purple-600 mb-3"></i>
              <h3 class="text-2xl font-bold text-purple-800">{{ learningStats.totalDays }}</h3>
              <p class="text-purple-600">学习天数</p>
            </div>
            <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 text-center">
              <i class="fas fa-star text-3xl text-amber-600 mb-3"></i>
              <h3 class="text-2xl font-bold text-amber-800">{{ learningStats.favoriteDynasty }}</h3>
              <p class="text-amber-600">偏爱朝代</p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">学习偏好</h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">最喜爱的朝代</span>
                  <span class="font-medium">{{ learningStats.favoriteDynasty }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">最喜爱的诗人</span>
                  <span class="font-medium">{{ learningStats.favoriteAuthor }}</span>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">学习建议</h3>
              <div class="space-y-2 text-sm text-gray-600">
                <p>• 建议多阅读{{ learningStats.favoriteDynasty }}朝代的诗词</p>
                <p>• 可以尝试创作一些{{ learningStats.favoriteAuthor }}风格的作品</p>
                <p>• 继续坚持每日学习，保持良好习惯</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 最近活动标签页 -->
        <div v-if="activeTab === 'activities'" class="p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">最近活动</h3>
          <div class="space-y-4">
            <div
              v-for="activity in recentActivities"
              :key="activity.poem"
              class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
            >
              <div class="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <i :class="{
                  'fas fa-book text-amber-600': activity.type === 'read',
                  'fas fa-heart text-red-500': activity.type === 'collect',
                  'fas fa-comment text-blue-500': activity.type === 'comment'
                }"></i>
              </div>
              <div class="flex-1">
                <p class="text-gray-800">
                  <span class="font-medium">{{ activity.type === 'read' ? '阅读了' : activity.type === 'collect' ? '收藏了' : '评论了' }}</span>
                  《{{ activity.poem }}》- {{ activity.author }}
                </p>
                <p class="text-sm text-gray-500">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 我的创作标签页 -->
        <div v-if="activeTab === 'creations'" class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-800">我的创作</h3>
            <button class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
              <i class="fas fa-plus mr-2"></i>
              新建创作
            </button>
          </div>
          <div class="space-y-4">
            <div
              v-for="creation in myCreations"
              :key="creation.id"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h4 class="font-semibold text-gray-800">{{ creation.title }}</h4>
                  <p class="text-sm text-gray-500">{{ formatDate(creation.createdAt) }}</p>
                </div>
                <div class="flex space-x-2">
                  <span :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    creation.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  ]">
                    {{ creation.status === 'published' ? '已发布' : '草稿' }}
                  </span>
                </div>
              </div>
              <div class="prose-poem mb-3">
                <p class="poem-line">{{ creation.content }}</p>
              </div>
              <div class="flex justify-between items-center">
                <div class="flex space-x-4 text-sm text-gray-500">
                  <span><i class="fas fa-heart mr-1"></i>{{ creation.likes }}</span>
                  <span><i class="fas fa-comment mr-1"></i>{{ creation.comments }}</span>
                </div>
                <div class="flex space-x-2">
                  <button
                    v-if="creation.status === 'draft'"
                    @click="publishCreation(creation.id)"
                    class="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
                  >
                    发布
                  </button>
                  <button
                    @click="deleteCreation(creation.id)"
                    class="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 设置标签页 -->
        <div v-if="activeTab === 'settings'" class="p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-6">账户设置</h3>
          <div class="space-y-6">
            <div class="border-b border-gray-200 pb-6">
              <h4 class="font-medium text-gray-800 mb-3">个人信息</h4>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                  <input
                    type="text"
                    :value="profile?.username || ''"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
                  <textarea
                    :value="profile?.bio || ''"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  ></textarea>
                </div>
              </div>
            </div>
            <div class="border-b border-gray-200 pb-6">
              <h4 class="font-medium text-gray-800 mb-3">通知设置</h4>
              <div class="space-y-3">
                <label class="flex items-center">
                  <input type="checkbox" class="rounded border-gray-300 text-amber-600 focus:ring-amber-500" checked />
                  <span class="ml-2 text-sm text-gray-700">接收新评论通知</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" class="rounded border-gray-300 text-amber-600 focus:ring-amber-500" checked />
                  <span class="ml-2 text-sm text-gray-700">接收学习提醒</span>
                </label>
              </div>
            </div>
            <div>
              <button class="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                保存设置
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>


