<script setup lang="ts">
import { ref } from 'vue'

const topics = ref([
  { id: 't1', title: "如何理解'诗中有画，画中有诗'?", replies: 32 },
  { id: 't2', title: '宋词中的婉约派与豪放派各有什么特色？', replies: 45 },
])
</script>

<template>
  <div class="max-w-5xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">社区讨论</h1>
    <div class="space-y-4">
      <div v-for="t in topics" :key="t.id" class="bg-white rounded-xl shadow p-5">
        <h3 class="text-lg font-semibold mb-2">{{ t.title }}</h3>
        <p class="text-gray-600">{{ t.replies }} 条回复</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>


