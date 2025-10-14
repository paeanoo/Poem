<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePoemStore } from '@/stores/poem'

const route = useRoute()
const router = useRouter()
const store = usePoemStore()

const keyword = ref<string>('')

const doSearch = async () => {
  const q = String(route.query.q || '')
  keyword.value = q
  if (!store.poems.length) {
    await store.fetchPoems()
  }
  await store.searchPoems({ keyword: q })
}

onMounted(doSearch)
watch(() => route.query.q, doSearch)

// 搜索结果页：直接展示完整作品，无需再点进去
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">搜索结果：{{ keyword }}</h1>
    <div v-if="store.loading" class="text-gray-500">搜索中...</div>
    <div v-else-if="store.searchResult && store.searchResult.total === 0" class="text-gray-500">未找到相关诗词</div>
    <div v-else-if="store.searchResult" class="space-y-6">
      <div v-for="p in store.searchResult.poems" :key="p.id" class="bg-white rounded-xl shadow p-6">
        <div class="mb-3">
          <h3 class="text-2xl font-bold mb-1">{{ p.title }}</h3>
          <p class="text-gray-600">{{ p.author }} · {{ p.dynasty }}</p>
        </div>
        <div class="prose-poem">
          <p v-for="(line, idx) in p.content" :key="idx" class="poem-line">{{ line }}</p>
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


