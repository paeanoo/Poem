<script setup lang="ts">
import { ref } from 'vue'

const collections = ref([
  { id: 'c1', name: '最爱唐诗', count: 5 },
  { id: 'c2', name: '宋词精选', count: 3 },
])
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">我的收藏</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="c in collections" :key="c.id" class="bg-white rounded-xl shadow p-5">
        <h3 class="text-xl font-semibold mb-2">{{ c.name }}</h3>
        <p class="text-gray-600">共 {{ c.count }} 首</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>


