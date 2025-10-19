<template>
  <div id="app">
    <SiteHeader />
    <!-- 路由视图容器 -->
    <RouterView />
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
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
