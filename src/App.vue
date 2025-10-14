<template>
  <div id="app">
    <!-- 路由视图容器 -->
    <RouterView />
  </div>
</template>

<script setup lang="ts">
// App.vue 现在只作为路由容器
</script>

<style>
#app {
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
}

/* 确保body和html没有默认边距 */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>