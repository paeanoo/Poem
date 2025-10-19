<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePoemStore } from '@/stores/poem'

const route = useRoute()
const router = useRouter()
const store = usePoemStore()

// 搜索状态
const keyword = ref<string>('')
const searchInput = ref<string>('')
const showAdvancedSearch = ref(false)

// 高级搜索选项
const searchFilters = ref({
  author: '',
  dynasty: '',
  sortBy: 'relevance', // relevance, title, author, dynasty
  sortOrder: 'desc' // asc, desc
})

// 可用的朝代选项
const dynastyOptions = ref(['唐', '宋', '元', '明', '清', '汉', '魏晋', '南北朝', '五代十国'])

// 搜索结果统计
const searchStats = computed(() => {
  if (!store.searchResult) return null
  return {
    total: store.searchResult.total,
    keyword: keyword.value,
    hasResults: store.searchResult.total > 0
  }
})

// 执行搜索
const doSearch = async (searchKeyword?: string) => {
  const q = searchKeyword || String(route.query.q || '')
  keyword.value = q
  searchInput.value = q

  if (!store.poems.length) {
    await store.fetchPoems()
  }

  const searchParams = {
    keyword: q,
    author: searchFilters.value.author,
    dynasty: searchFilters.value.dynasty,
    page: 1,
    limit: 50
  }

  await store.searchPoems(searchParams)
}

// 处理搜索提交
const handleSearch = () => {
  if (!searchInput.value.trim()) return

  // 更新URL参数
  router.push({
    name: 'search',
    query: {
      q: searchInput.value.trim(),
      author: searchFilters.value.author || undefined,
      dynasty: searchFilters.value.dynasty || undefined,
      sort: searchFilters.value.sortBy || undefined
    }
  })
}

// 清除搜索
const clearSearch = () => {
  searchInput.value = ''
  searchFilters.value = {
    author: '',
    dynasty: '',
    sortBy: 'relevance',
    sortOrder: 'desc'
  }
  router.push({ name: 'search' })
}

// 切换高级搜索
const toggleAdvancedSearch = () => {
  showAdvancedSearch.value = !showAdvancedSearch.value
}

// 应用筛选器
const applyFilters = () => {
  doSearch(searchInput.value)
}

// 清除筛选器
const clearFilters = () => {
  searchFilters.value.author = ''
  searchFilters.value.dynasty = ''
  doSearch(searchInput.value)
}

// 跳转到诗词详情
const goToPoemDetail = (poemId: string) => {
  router.push({ name: 'poem-detail', params: { id: poemId } })
}

// 跳转到作者页面
const goToAuthorPage = (author: string) => {
  router.push({ name: 'poet', params: { name: author } })
}

onMounted(() => {
  const q = String(route.query.q || '')
  const author = String(route.query.author || '')
  const dynasty = String(route.query.dynasty || '')
  const sort = String(route.query.sort || 'relevance')

  keyword.value = q
  searchInput.value = q
  searchFilters.value.author = author
  searchFilters.value.dynasty = dynasty
  searchFilters.value.sortBy = sort

  doSearch()
})

watch(() => route.query, () => {
  const q = String(route.query.q || '')
  const author = String(route.query.author || '')
  const dynasty = String(route.query.dynasty || '')
  const sort = String(route.query.sort || 'relevance')

  keyword.value = q
  searchInput.value = q
  searchFilters.value.author = author
  searchFilters.value.dynasty = dynasty
  searchFilters.value.sortBy = sort

  doSearch()
})
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- 搜索头部 -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div class="flex items-center space-x-4 mb-4">
        <div class="flex-1">
          <div class="relative">
            <input
              v-model="searchInput"
              type="text"
              placeholder="搜索诗词、作者..."
              class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              @keyup.enter="handleSearch"
            />
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>
        <button
          @click="handleSearch"
          class="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          搜索
        </button>
        <button
          @click="toggleAdvancedSearch"
          class="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <i class="fas fa-filter mr-2"></i>
          高级搜索
        </button>
      </div>

      <!-- 高级搜索面板 -->
      <div v-if="showAdvancedSearch" class="border-t border-gray-200 pt-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">作者</label>
            <input
              v-model="searchFilters.author"
              type="text"
              placeholder="输入作者姓名"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">朝代</label>
            <select
              v-model="searchFilters.dynasty"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">全部朝代</option>
              <option v-for="dynasty in dynastyOptions" :key="dynasty" :value="dynasty">
                {{ dynasty }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">排序方式</label>
            <select
              v-model="searchFilters.sortBy"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="relevance">相关度</option>
              <option value="title">标题</option>
              <option value="author">作者</option>
              <option value="dynasty">朝代</option>
            </select>
          </div>
        </div>
        <div class="flex space-x-3">
          <button
            @click="applyFilters"
            class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            应用筛选
          </button>
          <button
            @click="clearFilters"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            清除筛选
          </button>
        </div>
      </div>
    </div>

    <!-- 搜索结果统计 -->
    <div v-if="searchStats" class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">
            {{ searchStats.hasResults ? `找到 ${searchStats.total} 首相关诗词` : '未找到相关诗词' }}
          </h1>
          <p v-if="searchStats.hasResults" class="text-gray-600 mt-1">
            关键词：{{ searchStats.keyword }}
          </p>
        </div>
        <button
          v-if="searchStats.hasResults"
          @click="clearSearch"
          class="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <i class="fas fa-times mr-1"></i>
          清除搜索
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="store.loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      <p class="mt-2 text-gray-600">搜索中...</p>
    </div>

    <!-- 无结果 -->
    <div v-else-if="!searchStats?.hasResults" class="text-center py-12">
      <div class="max-w-md mx-auto">
        <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">未找到相关诗词</h3>
        <p class="text-gray-500 mb-6">请尝试其他关键词或调整搜索条件</p>
        <button
          @click="clearSearch"
          class="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          重新搜索
        </button>
      </div>
    </div>

    <!-- 搜索结果列表 -->
    <div v-else-if="store.searchResult" class="space-y-6">
      <div
        v-for="poem in store.searchResult.poems"
        :key="poem.id"
        class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
        @click="goToPoemDetail(poem.id)"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <h3 class="text-2xl font-bold text-gray-800 mb-2">{{ poem.title }}</h3>
            <div class="flex items-center space-x-4 text-gray-600">
              <button
                @click.stop="goToAuthorPage(poem.author)"
                class="hover:text-amber-600 transition-colors"
              >
                <i class="fas fa-user mr-1"></i>
                {{ poem.author }}
              </button>
              <span>
                <i class="fas fa-calendar mr-1"></i>
                {{ poem.dynasty }}
              </span>
            </div>
          </div>
          <div class="flex space-x-2">
            <button class="p-2 text-gray-400 hover:text-amber-600 transition-colors">
              <i class="far fa-heart"></i>
            </button>
            <button class="p-2 text-gray-400 hover:text-amber-600 transition-colors">
              <i class="fas fa-share-alt"></i>
            </button>
          </div>
        </div>

        <div class="prose-poem">
          <p v-for="(line, idx) in poem.content" :key="idx" class="poem-line">{{ line }}</p>
        </div>

        <div v-if="poem.tags?.length" class="mt-4 pt-4 border-t border-gray-100">
          <div class="flex flex-wrap gap-2">
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
  </div>
</template>

<style scoped>
/* 借鉴常见诗词网站的排版：较大的行高、居左分行、段间距舒适 */
.poem-line {
  font-size: 1.125rem; /* text-lg */
  line-height: 2rem;  /* leading-8 */
  color: #374151;     /* gray-700 */
  margin: 0.25rem 0;  /* space-y-2 效果 */
}
.prose-poem {
  padding-top: 0.25rem;
}
</style>


