<!-- src/views/Interview/components/ModuleTitle.vue -->
<template>
  <div class="title-wrapper">
    <h1 class="main-title">{{ mainTitle }}</h1>
    <p class="sub-title">{{ subTitle }}</p>
  </div>
</template>

<script setup>
defineProps({
  mainTitle: {
    type: String,
    default: '选择你要面试的方式'
  },
})
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.title-wrapper {
  text-align: center;
  margin-bottom: 20px;
  
  .main-title {
    font-size: 25px;
    font-weight: 600;
    color: rgb(68, 68, 68);
    margin-bottom: 5px;
    letter-spacing: -0.5px;
  }
}
</style>