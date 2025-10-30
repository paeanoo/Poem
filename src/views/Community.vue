<script setup lang="ts" name="PoemCommunity">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePoemStore } from '@/stores/poem'
import { handleAvatarError } from '@/utils/avatarUtils'

const auth = useAuthStore()
const store = usePoemStore()
const router = useRouter()

// 社区状态
const activeTab = ref('discussions')

// 讨论话题
const topics = ref([
  {
    id: 't1',
    title: "如何理解'诗中有画，画中有诗'?",
    content: "王维的诗作常被人评价为'诗中有画'，这种艺术境界是如何实现的？",
    author: '诗词爱好者',
    replies: 32,
    views: 1250,
    lastReply: '2小时前',
    tags: ['王维', '诗画', '艺术'],
    createdAt: '2024-01-15'
  },
  {
    id: 't2',
    title: '宋词中的婉约派与豪放派各有什么特色？',
    content: '以李清照和苏轼为例，探讨婉约派与豪放派在风格和表现手法上的差异。',
    author: '文学研究者',
    replies: 45,
    views: 2100,
    lastReply: '1天前',
    tags: ['宋词', '婉约派', '豪放派'],
    createdAt: '2024-01-14'
  },
  {
    id: 't3',
    title: '现代诗歌如何传承古典诗词的意境？',
    content: '当代诗人在创作中如何汲取古典诗词的营养，又如何体现时代特色？',
    author: '现代诗人',
    replies: 28,
    views: 980,
    lastReply: '3天前',
    tags: ['现代诗', '传承', '意境'],
    createdAt: '2024-01-12'
  }
])

// 用户创作
const userCreations = ref([
  {
    id: 'c1',
    title: '秋思',
    content: '枫叶飘零满径黄，西风瑟瑟透心凉。思君不见君何处，唯有明月照空床。',
    author: '墨香书生',
    authorAvatar: 'https://ai-public.mastergo.com/ai/img_res/0c4b445fafc506c9ee9035859ae21770.jpg',
    likes: 24,
    comments: 8,
    createdAt: '2小时前',
    tags: ['原创', '秋思', '思君']
  },
  {
    id: 'c2',
    title: '读李白《将进酒》有感',
    content: '人生得意须尽欢，莫使金樽空对月。古来圣贤皆寂寞，惟有饮者留其名。',
    author: '诗韵雅音',
    authorAvatar: 'https://ai-public.mastergo.com/ai/img_res/29305598ac33dabe6421504efeeda494.jpg',
    likes: 42,
    comments: 15,
    createdAt: '5小时前',
    tags: ['读后感', '李白', '将进酒']
  },
  {
    id: 'c3',
    title: '山居吟',
    content: '青山如黛水如琴，白鹭翩翩入翠林。最爱夕阳西下处，炊烟袅袅绕山村。',
    author: '山水清音',
    authorAvatar: 'https://ai-public.mastergo.com/ai/img_res/fc1b7064e6e7e935e08d46f04826eb29.jpg',
    likes: 67,
    comments: 23,
    createdAt: '1天前',
    tags: ['原创', '山居', '田园']
  }
])

// 热门诗词
const hotPoems = computed(() => store.poems.slice(0, 5))

// 切换标签页
const switchTab = (tab: string) => {
  activeTab.value = tab
}

// 跳转到话题详情
const goToTopic = (topicId: string) => {
  // 这里可以跳转到话题详情页
  console.log('跳转到话题:', topicId)
}

// 跳转到诗词详情
const goToPoemDetail = (poemId: string) => {
  router.push({ name: 'poem-detail', params: { id: poemId } })
}

// 点赞创作
const likeCreation = (creationId: string) => {
  const creation = userCreations.value.find(c => c.id === creationId)
  if (creation) {
    creation.likes++
  }
}

// 分享创作
const shareCreation = (creationId: string) => {
  // 实现分享功能
  console.log('分享创作:', creationId)
}

onMounted(async () => {
  // 加载热门诗词
  if (!store.poems.length) {
    await store.fetchPoems()
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- 页面头部 -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">诗词社区</h1>
          <p class="text-gray-600">与诗词爱好者一起交流学习，分享创作心得</p>
        </div>
        <div class="flex space-x-3">
          <button
            v-if="auth.user"
            class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <i class="fas fa-plus mr-2"></i>
            发布话题
          </button>
          <button
            v-else
            @click="$router.push('/login')"
            class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <i class="fas fa-sign-in-alt mr-2"></i>
            登录参与
          </button>
        </div>
      </div>
    </div>

    <!-- 标签页导航 -->
    <div class="bg-white rounded-xl shadow-lg mb-6">
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8 px-6">
          <button
            @click="switchTab('discussions')"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'discussions'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            ]"
          >
            <i class="fas fa-comments mr-2"></i>
            讨论话题
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
            用户创作
          </button>
          <button
            @click="switchTab('hot')"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'hot'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            ]"
          >
            <i class="fas fa-fire mr-2"></i>
            热门诗词
          </button>
        </nav>
      </div>
    </div>

    <!-- 讨论话题标签页 -->
    <div v-if="activeTab === 'discussions'" class="space-y-6">
      <div
        v-for="topic in topics"
        :key="topic.id"
        class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
        @click="goToTopic(topic.id)"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-800 mb-2">{{ topic.title }}</h3>
            <p class="text-gray-600 mb-3">{{ topic.content }}</p>
            <div class="flex items-center space-x-4 text-sm text-gray-500">
              <span>
                <i class="fas fa-user mr-1"></i>
                {{ topic.author }}
              </span>
              <span>
                <i class="fas fa-comments mr-1"></i>
                {{ topic.replies }} 回复
              </span>
              <span>
                <i class="fas fa-eye mr-1"></i>
                {{ topic.views }} 浏览
              </span>
              <span>
                <i class="fas fa-clock mr-1"></i>
                {{ topic.lastReply }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in topic.tags"
            :key="tag"
            class="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <!-- 用户创作标签页 -->
    <div v-if="activeTab === 'creations'" class="space-y-6">
      <div
        v-for="creation in userCreations"
        :key="creation.id"
        class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
      >
        <div class="flex items-start space-x-4 mb-4">
          <img
            :src="creation.authorAvatar"
            :alt="creation.author"
            class="w-12 h-12 rounded-full object-cover"
            @error="handleAvatarError"
          />
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-2">
              <h4 class="font-semibold text-gray-800">{{ creation.author }}</h4>
              <span class="text-sm text-gray-500">{{ creation.createdAt }}</span>
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">{{ creation.title }}</h3>
            <div class="prose-poem mb-4">
              <p class="poem-line">{{ creation.content }}</p>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex space-x-4">
                <button
                  @click="likeCreation(creation.id)"
                  class="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <i class="fas fa-heart"></i>
                  <span>{{ creation.likes }}</span>
                </button>
                <button class="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                  <i class="fas fa-comment"></i>
                  <span>{{ creation.comments }}</span>
                </button>
                <button
                  @click="shareCreation(creation.id)"
                  class="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors"
                >
                  <i class="fas fa-share-alt"></i>
                  <span>分享</span>
                </button>
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in creation.tags"
                  :key="tag"
                  class="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 热门诗词标签页 -->
    <div v-if="activeTab === 'hot'" class="space-y-6">
      <div
        v-for="poem in hotPoems"
        :key="poem.id"
        class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
        @click="goToPoemDetail(poem.id)"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-800 mb-2">{{ poem.title }}</h3>
            <p class="text-gray-600 mb-3">{{ poem.author }} · {{ poem.dynasty }}</p>
            <div class="prose-poem">
              <p v-for="(line, idx) in poem.content.slice(0, 4)" :key="idx" class="poem-line">
                {{ line }}
              </p>
            </div>
          </div>
          <div class="flex space-x-2 ml-4">
            <button class="p-2 text-gray-400 hover:text-amber-600 transition-colors">
              <i class="far fa-heart"></i>
            </button>
            <button class="p-2 text-gray-400 hover:text-amber-600 transition-colors">
              <i class="fas fa-share-alt"></i>
            </button>
          </div>
        </div>
        <div v-if="poem.tags?.length" class="flex flex-wrap gap-2">
          <span
            v-for="tag in poem.tags"
            :key="tag"
            class="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>


