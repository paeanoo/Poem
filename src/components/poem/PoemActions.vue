<template>
  <div class="flex items-center space-x-4">
    <!-- 点赞按钮 -->
    <button
      @click="handleLike"
      :disabled="!auth.user"
      class="flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors"
      :class="[
        isLiked
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      ]"
    >
      <svg
        class="w-4 h-4"
        :class="{ 'fill-current': isLiked }"
        viewBox="0 0 20 20"
      >
        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
      </svg>
      <span class="text-sm font-medium">{{ likeCount }}</span>
    </button>

    <!-- 收藏按钮 -->
    <button
      @click="handleCollect"
      :disabled="!auth.user"
      class="flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors"
      :class="[
        isCollected
          ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      ]"
    >
      <svg
        class="w-4 h-4"
        :class="{ 'fill-current': isCollected }"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span class="text-sm font-medium">{{ isCollected ? '已收藏' : '收藏' }}</span>
    </button>

    <!-- 分享按钮 -->
    <button
      @click="handleShare"
      class="flex items-center space-x-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
    >
      <svg class="w-4 h-4" viewBox="0 0 20 20">
        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
      </svg>
      <span class="text-sm font-medium">分享</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { likes, collections } from '@/services/supabase'

interface Props {
  poemId: string
  poemData: Record<string, unknown>
}

const props = defineProps<Props>()
const auth = useAuthStore()

// 状态
const isLiked = ref(false)
const isCollected = ref(false)
const likeCount = ref(0)
const loading = ref(false)

// 检查点赞状态
const checkLikeStatus = async () => {
  if (!auth.user) return

  try {
    const { isLiked: liked } = await likes.isPoemLiked(auth.user.id, props.poemId)
    isLiked.value = liked
  } catch (error) {
    console.error('检查点赞状态失败:', error)
  }
}

// 检查收藏状态
const checkCollectStatus = async () => {
  if (!auth.user) return

  try {
    const { isCollected: collected } = await collections.isPoemCollected(auth.user.id, props.poemId)
    isCollected.value = collected
  } catch (error) {
    console.error('检查收藏状态失败:', error)
  }
}

// 获取点赞数
const getLikeCount = async () => {
  try {
    const { count } = await likes.getPoemLikeCount(props.poemId)
    likeCount.value = count
  } catch (error) {
    console.error('获取点赞数失败:', error)
  }
}

// 处理点赞
const handleLike = async () => {
  if (!auth.user || loading.value) return

  loading.value = true
  try {
    if (isLiked.value) {
      await likes.unlikePoem(auth.user.id, props.poemId)
      isLiked.value = false
      likeCount.value = Math.max(0, likeCount.value - 1)
    } else {
      await likes.likePoem(auth.user.id, props.poemId)
      isLiked.value = true
      likeCount.value += 1
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理收藏
const handleCollect = async () => {
  if (!auth.user || loading.value) return

  loading.value = true
  try {
    if (isCollected.value) {
      // 这里需要先获取收藏ID，简化处理
      console.log('取消收藏功能待实现')
    } else {
      await collections.addToCollection(auth.user.id, props.poemId, props.poemData)
      isCollected.value = true
    }
  } catch (error) {
    console.error('收藏操作失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理分享
const handleShare = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: '诗词分享',
        text: '分享一首优美的诗词',
        url: window.location.href
      })
    } catch (error) {
      console.log('分享取消')
    }
  } else {
    // 复制链接到剪贴板
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板')
    } catch (error) {
      console.error('复制失败:', error)
    }
  }
}

onMounted(async () => {
  await Promise.all([
    checkLikeStatus(),
    checkCollectStatus(),
    getLikeCount()
  ])
})
</script>
