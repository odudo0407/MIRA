<!-- src/views/Community/components/CategoryTabs.vue -->
<template>
  <div class="category-tabs">
    <div 
      v-for="tab in tabs" 
      :key="tab"
      class="tab"
      :class="{ active: modelValue === tab }"
      @click="handleTabClick(tab)"
    >
      {{ tab }}
    </div>
  </div>
</template>

<script setup>
defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const tabs = ['全部', '面经分享', '技术问答', '求职吐槽', '资源推荐']

const handleTabClick = (tab) => {
  emit('update:modelValue', tab)
}
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.category-tabs {
  display: flex;
  gap: 20px;
  border-bottom: 2px solid $border-light;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.tab {
  font-size: 16px;
  font-weight: 500;
  color: $text-regular;
  cursor: pointer;
  padding: 5px 0;
  transition: all 0.3s;
  
  &:hover {
    color: $primary;
  }
  
  &.active {
    color: $primary;
    border-bottom: 2px solid $primary;
    margin-bottom: -12px;
  }
}
</style>