<template>
  <div class="load-more">
    <button @click="$emit('load-more')">加载更多</button>
  </div>
</template>

<script setup>
defineEmits(['load-more'])
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.load-more {
  text-align: center;
  margin: 40px 0;

  button {
    padding: 12px 40px;
    background: transparent;
    border: 2px solid $primary;
    color: $primary;
    border-radius: 30px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: $primary;
      color: white;
    }
  }
}
</style>