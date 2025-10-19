<script setup lang="ts" name="AuthCallback">
import { onMounted, ref } from 'vue'
const msg = ref('正在处理邮箱验证，请稍候...')

onMounted(async () => {
  // 邮箱验证回跳后，直接提示用户去登录
  msg.value = '邮箱验证完成，请使用注册邮箱登录。'
})
</script>

<template>
  <div class="wrap">
    <p>{{ msg }}</p>
    <RouterLink to="/">返回首页</RouterLink>
  </div>
</template>

<style scoped>
.wrap { min-height: calc(100vh - 56px - 120px); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; }
</style>

