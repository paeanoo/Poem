<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePoemStore } from '@/stores/poem'

const route = useRoute()
const store = usePoemStore()

const poemId = computed(() => String(route.params.id || ''))
const poem = computed(() => store.poems.find(p => p.id === poemId.value) || store.currentPoem)
const analysis = computed(() => store.currentAnalysis)

onMounted(async () => {
  if (!store.poems.length) {
    await store.fetchPoems()
  }
  await store.fetchPoemById(poemId.value)
  await store.fetchPoemAnalysis(poemId.value, 'basic')
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <div v-if="store.loading" class="text-gray-500">加载中...</div>
    <div v-else-if="store.error" class="text-red-600">{{ store.error }}</div>
    <div v-else-if="poem" class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold mb-2">{{ poem!.title }}</h1>
        <p class="text-gray-600">{{ poem!.author }} · {{ poem!.dynasty }}</p>
      </div>
      <div class="bg-white rounded-xl shadow p-6 space-y-2">
        <p v-for="(line, idx) in poem!.content" :key="idx" class="text-lg leading-8">{{ line }}</p>
      </div>
      <div v-if="analysis" class="bg-white rounded-xl shadow p-6 space-y-3">
        <h2 class="text-2xl font-semibold mb-2">赏析</h2>
        <p v-if="analysis!.content.background" class="text-gray-700">{{ analysis!.content.background }}</p>
        <p v-if="analysis!.content.translation" class="text-gray-700">{{ analysis!.content.translation }}</p>
        <p v-if="analysis!.content.appreciation" class="text-gray-700">{{ analysis!.content.appreciation }}</p>
      </div>
    </div>
  </div>
  </template>

<style scoped>
</style>


