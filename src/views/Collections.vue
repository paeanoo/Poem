<script setup lang="ts" name="PoemCollections">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePoemStore } from '@/stores/poem'
import { collections as svcCollections } from '@/services/supabase'

const auth = useAuthStore()
const store = usePoemStore()
const router = useRouter()

const loading = ref(false)
const error = ref<string | null>(null)
const collections = ref<any[]>([])

// 收藏的诗词数据
const collectedPoems = computed(() => {
  return collections.value.map(collection => {
    const poemData = collection.poem_data
    return {
      id: collection.id,
      poemId: collection.poem_id,
      title: poemData?.title || '未知标题',
      author: poemData?.author || '未知作者',
      dynasty: poemData?.dynasty || '未知朝代',
      content: poemData?.content || [],
      createdAt: collection.created_at,
      tags: poemData?.tags || []
    }
  })
})

// 加载收藏列表
const loadCollections = async () => {
  if (!auth.user) return

  loading.value = true
  error.value = null

  try {
    const { data, error: err } = await svcCollections.getUserCollections(auth.user.id)
    if (err) {
      // 检查是否是表不存在的错误
      if (err.message.includes('user_collections') || err.message.includes('schema cache')) {
        error.value = '数据库表未创建，请联系管理员'
        console.error('数据库表不存在:', err)
      } else {
        error.value = err.message
      }
      return
    }
    collections.value = data || []
  } catch (err: any) {
    if (err.message?.includes('user_collections') || err.message?.includes('schema cache')) {
      error.value = '数据库表未创建，请联系管理员'
    } else {
      error.value = '加载收藏失败'
    }
    console.error('加载收藏失败:', err)
  } finally {
    loading.value = false
  }
}

// 移除收藏
const removeCollection = async (collectionId: string) => {
  try {
    const { error: err } = await svcCollections.removeFromCollection(collectionId)
    if (err) {
      console.error('移除收藏失败:', err)
      return
    }
    // 重新加载收藏列表
    await loadCollections()
  } catch (err) {
    console.error('移除收藏失败:', err)
  }
}

// 跳转到诗词详情
const goToPoemDetail = (poemId: string) => {
  router.push({ name: 'poem-detail', params: { id: poemId } })
}

// 跳转到作者页面
const goToAuthorPage = (author: string) => {
  router.push({ name: 'poet', params: { name: author } })
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

onMounted(() => {
  loadCollections()
})
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- 页面头部 -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">我的收藏</h1>
          <p class="text-gray-600">
            {{ collectedPoems.length > 0 ? `共收藏 ${collectedPoems.length} 首诗词` : '还没有收藏任何诗词' }}
          </p>
        </div>
        <div class="flex space-x-3">
          <button
            @click="loadCollections"
            class="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
          >
            <i class="fas fa-sync-alt mr-2"></i>
            刷新
          </button>
        </div>
      </div>
    </div>

    <!-- 未登录状态 -->
    <div v-if="!auth.user" class="text-center py-12">
      <div class="max-w-md mx-auto">
        <i class="fas fa-heart text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">请先登录</h3>
        <p class="text-gray-500 mb-6">登录后可以收藏喜欢的诗词</p>
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
      <div class="max-w-lg mx-auto">
        <i class="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">加载失败</h3>
        <p class="text-gray-500 mb-4">{{ error }}</p>

        <!-- 数据库表未创建的解决方案 -->
        <div v-if="error.includes('数据库表未创建')" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
          <h4 class="font-semibold text-blue-800 mb-2">解决方案：</h4>
          <ol class="text-sm text-blue-700 space-y-1">
            <li>1. 打开Supabase控制台</li>
            <li>2. 进入SQL编辑器</li>
            <li>3. 执行项目根目录下的 <code class="bg-blue-100 px-1 rounded">supabase-schema.sql</code> 文件</li>
            <li>4. 等待表创建完成后重新加载页面</li>
          </ol>
        </div>

        <div class="flex space-x-3 justify-center">
          <button
            @click="loadCollections"
            class="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            重新加载
          </button>
          <button
            @click="$router.push('/')"
            class="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="collectedPoems.length === 0" class="text-center py-12">
      <div class="max-w-md mx-auto">
        <i class="fas fa-heart text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">还没有收藏</h3>
        <p class="text-gray-500 mb-6">去发现一些喜欢的诗词吧</p>
        <button
          @click="$router.push('/')"
          class="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          开始探索
        </button>
      </div>
    </div>

    <!-- 收藏列表 -->
    <div v-else class="space-y-6">
      <div
        v-for="poem in collectedPoems"
        :key="poem.id"
        class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <h3 class="text-2xl font-bold text-gray-800 mb-2 cursor-pointer hover:text-amber-600 transition-colors"
                @click="goToPoemDetail(poem.poemId)">
              {{ poem.title }}
            </h3>
            <div class="flex items-center space-x-4 text-gray-600 mb-3">
              <button
                @click="goToAuthorPage(poem.author)"
                class="hover:text-amber-600 transition-colors"
              >
                <i class="fas fa-user mr-1"></i>
                {{ poem.author }}
              </button>
              <span>
                <i class="fas fa-calendar mr-1"></i>
                {{ poem.dynasty }}
              </span>
              <span>
                <i class="fas fa-clock mr-1"></i>
                {{ formatDate(poem.createdAt) }}
              </span>
            </div>
          </div>
          <div class="flex space-x-2">
            <button
              @click="goToPoemDetail(poem.poemId)"
              class="p-2 text-gray-400 hover:text-amber-600 transition-colors"
              title="查看详情"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button
              @click="removeCollection(poem.id)"
              class="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="移除收藏"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>

        <!-- 诗词内容预览 -->
        <div class="prose-poem mb-4">
          <p v-for="(line, idx) in poem.content.slice(0, 4)" :key="idx" class="poem-line">
            {{ line }}
          </p>
          <p v-if="poem.content.length > 4" class="text-gray-500 text-sm mt-2">
            ... 还有 {{ poem.content.length - 4 }} 句
          </p>
        </div>

        <!-- 标签 -->
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


