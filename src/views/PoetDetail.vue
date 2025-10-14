<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePoemStore } from '@/stores/poem'

const route = useRoute()
const router = useRouter()
const store = usePoemStore()

const poetName = computed(() => String(route.params.name || ''))
const poemsByPoet = computed(() => store.poems.filter(p => p.author === poetName.value))

onMounted(async () => {
  if (!store.poems.length) {
    await store.fetchPoems({ author: poetName.value })
  }
})

const goDetail = (id: string) => {
  router.push({ name: 'poem-detail', params: { id } })
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">{{ poetName }} · 作品</h1>
    <div v-if="store.loading" class="text-gray-500">加载中...</div>
    <div v-else-if="poemsByPoet.length === 0" class="text-gray-500">暂无作品</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="p in poemsByPoet" :key="p.id" class="bg-white rounded-xl shadow p-5 cursor-pointer hover:shadow-md" @click="goDetail(p.id)">
        <h3 class="text-xl font-semibold mb-1">{{ p.title }}</h3>
        <p class="text-gray-600 mb-3">{{ p.author }} · {{ p.dynasty }}</p>
        <p class="text-gray-700 line-clamp-2">{{ p.content.join('，') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>


