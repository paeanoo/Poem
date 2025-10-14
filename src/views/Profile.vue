<script setup lang="ts">
import { ref } from 'vue'

const user = ref({
  username: 'poem_lover',
  nickname: '诗意栖居',
  level: 'intermediate',
  stats: { studiedPoems: 42, favoritePoems: 12, studyTime: 360 },
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">个人中心</h1>
    <div class="bg-white rounded-xl shadow p-6">
      <p class="mb-2">用户名：{{ user.username }}</p>
      <p class="mb-2">昵称：{{ user.nickname }}</p>
      <p class="mb-2">等级：{{ user.level }}</p>
      <div class="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div class="text-2xl font-bold">{{ user.stats.studiedPoems }}</div>
          <div class="text-gray-600">已学</div>
        </div>
        <div>
          <div class="text-2xl font-bold">{{ user.stats.favoritePoems }}</div>
          <div class="text-gray-600">收藏</div>
        </div>
        <div>
          <div class="text-2xl font-bold">{{ user.stats.studyTime }}</div>
          <div class="text-gray-600">学习分钟</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>


