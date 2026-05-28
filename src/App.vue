<script setup>
import Home from './views/Home/index.vue'
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
@import '@/styles/index.scss';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

// 所有路由页面的根元素自动成为flex子项
#app > div {
  flex: 1;
  display: flex;
  flex-direction: column;
}

// 确保所有页面的主要内容区域可以扩展
.main-content,
.container,
.page-container,
.content-wrapper {
  flex: 1;
  width: 100%;
}
</style>