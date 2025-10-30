<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePoemStore } from '@/stores/poem'
import PoemActions from '@/components/poem/PoemActions.vue'

const route = useRoute()
const router = useRouter()
const store = usePoemStore()

const poemId = computed(() => String(route.params.id || ''))
const poem = computed(() => store.poems.find(p => p.id === poemId.value) || store.currentPoem)
const analysis = computed(() => store.currentAnalysis)

// 标签页状态
const activeTab = ref('content')
const analysisLevel = ref<'basic' | 'advanced' | 'expert'>('basic')

// 相关诗词
type PoemType = typeof poem.value
const relatedPoems = ref<NonNullable<PoemType>[]>([])

// 切换赏析级别
const switchAnalysisLevel = async (level: 'basic' | 'advanced' | 'expert') => {
  analysisLevel.value = level
  await store.fetchPoemAnalysis(poemId.value, level)
}

// 加载相关诗词
const loadRelatedPoems = async () => {
  const currentPoem = poem.value
  if (!currentPoem) return

  try {
    const allPoems = await store.fetchPoems()
    // 基于作者和朝代推荐相关诗词
    relatedPoems.value = allPoems
      .filter(p => p.id !== currentPoem.id && (p.author === currentPoem.author || p.dynasty === currentPoem.dynasty))
      .slice(0, 4)
  } catch (error) {
    console.error('加载相关诗词失败:', error)
  }
}

onMounted(async () => {
  if (!store.poems.length) {
    await store.fetchPoems()
  }
  await store.fetchPoemById(poemId.value)
  await store.fetchPoemAnalysis(poemId.value, 'basic')
  await loadRelatedPoems()
})
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <div v-if="store.loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      <p class="mt-2 text-gray-600">加载中...</p>
    </div>
    <div v-else-if="store.error" class="text-center py-12">
      <p class="text-red-600">{{ store.error }}</p>
    </div>
    <div v-else-if="poem" class="space-y-8">
      <!-- 诗词标题和操作栏 -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <div class="flex justify-between items-start mb-6">
      <div>
            <h1 class="text-4xl font-bold text-gray-800 mb-2">{{ poem.title }}</h1>
            <p class="text-xl text-gray-600">{{ poem.author }} · {{ poem.dynasty }}</p>
          </div>
          <PoemActions
            v-if="poem"
            :poem-id="poem.id"
            :poem-data="{
              title: poem.title,
              author: poem.author,
              dynasty: poem.dynasty,
              content: poem.content
            }"
          />
        </div>

        <!-- 标签页导航 -->
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8">
            <button
              @click="activeTab = 'content'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'content'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              ]"
            >
              原文
            </button>
            <button
              @click="activeTab = 'analysis'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'analysis'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              ]"
            >
              赏析
            </button>
            <button
              @click="activeTab = 'related'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'related'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              ]"
            >
              相关作品
            </button>
          </nav>
        </div>
      </div>

      <!-- 标签页内容 -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <!-- 原文标签页 -->
        <div v-if="activeTab === 'content'" class="space-y-6">
          <div class="text-center">
            <div class="prose-poem max-w-2xl mx-auto">
              <p v-for="(line, idx) in poem.content" :key="idx" class="poem-line text-center">{{ line }}</p>
            </div>
          </div>

          <!-- 多媒体资源 -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <h3 class="text-lg font-semibold mb-4">相关资源</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-gray-50 rounded-lg p-4 text-center">
                <i class="fas fa-volume-up text-2xl text-amber-600 mb-2"></i>
                <p class="text-sm text-gray-600">名家朗诵</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4 text-center">
                <i class="fas fa-palette text-2xl text-amber-600 mb-2"></i>
                <p class="text-sm text-gray-600">相关画作</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4 text-center">
                <i class="fas fa-book text-2xl text-amber-600 mb-2"></i>
                <p class="text-sm text-gray-600">历史背景</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 赏析标签页 -->
        <div v-if="activeTab === 'analysis'" class="space-y-6">
          <!-- 赏析级别选择 -->
          <div class="flex space-x-4 mb-6">
            <button
              @click="switchAnalysisLevel('basic')"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                analysisLevel === 'basic'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              基础赏析
            </button>
            <button
              @click="switchAnalysisLevel('advanced')"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                analysisLevel === 'advanced'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              进阶赏析
            </button>
            <button
              @click="switchAnalysisLevel('expert')"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                analysisLevel === 'expert'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              专家解读
            </button>
          </div>

          <!-- 赏析内容 -->
          <div v-if="analysis" class="space-y-6">
            <div v-if="analysis.content.background" class="bg-blue-50 rounded-lg p-6">
              <h4 class="font-semibold text-blue-800 mb-2">创作背景</h4>
              <p class="text-blue-700">{{ analysis.content.background }}</p>
            </div>

            <div v-if="analysis.content.theme" class="bg-green-50 rounded-lg p-6">
              <h4 class="font-semibold text-green-800 mb-2">主题思想</h4>
              <p class="text-green-700">{{ analysis.content.theme }}</p>
            </div>

            <div v-if="analysis.content.translation" class="bg-purple-50 rounded-lg p-6">
              <h4 class="font-semibold text-purple-800 mb-2">现代译文</h4>
              <p class="text-purple-700">{{ analysis.content.translation }}</p>
            </div>

            <div v-if="analysis.content.appreciation" class="bg-amber-50 rounded-lg p-6">
              <h4 class="font-semibold text-amber-800 mb-2">艺术赏析</h4>
              <p class="text-amber-700">{{ analysis.content.appreciation }}</p>
            </div>

            <div v-if="analysis.content.techniques?.length" class="bg-gray-50 rounded-lg p-6">
              <h4 class="font-semibold text-gray-800 mb-3">艺术手法</h4>
              <div class="flex flex-wrap gap-2">
                <span v-for="technique in analysis.content.techniques" :key="technique"
                      class="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                  {{ technique }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 相关作品标签页 -->
        <div v-if="activeTab === 'related'" class="space-y-6">
          <h3 class="text-lg font-semibold">相关作品</h3>
          <div v-if="relatedPoems.length === 0" class="text-center py-8 text-gray-500">
            暂无相关作品
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="relatedPoem in relatedPoems"
              :key="relatedPoem.id"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              @click="router.push({ name: 'poem-detail', params: { id: relatedPoem.id } })"
            >
              <h4 class="font-semibold text-gray-800 mb-1">{{ relatedPoem.title }}</h4>
              <p class="text-sm text-gray-600 mb-2">{{ relatedPoem.author }} · {{ relatedPoem.dynasty }}</p>
              <p class="text-sm text-gray-700 line-clamp-2">{{ relatedPoem.content.slice(0, 2).join('，') }}</p>
            </div>
          </div>
      </div>
      </div>
    </div>
  </div>
  </template>

<style scoped>
</style>


