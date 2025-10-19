<template>
  <div class="not-found">
    <h1>404</h1>
    <p>抱歉，您访问的页面不存在。</p>
    <RouterLink to="/">返回首页</RouterLink>
  </div>
</template>

<script setup lang="ts" name="NotFound"></script>

<style scoped>
.not-found {
  min-height: calc(100vh - 56px - 120px);
  padding: 48px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
h1 { margin: 0; font-size: 72px; }
</style>

