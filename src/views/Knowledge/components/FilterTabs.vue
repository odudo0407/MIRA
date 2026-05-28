<!-- src/views/Knowledge/components/FilterTabs.vue -->
<template>
  <div class="filter-tabs">
    <div 
      v-for="tab in tabs" 
      :key="tab"
      class="tab"
      :class="{ active: activeTab === tab }"
      @click="$emit('tab-change', tab)"
    >
      {{ tab }}
    </div>
  </div>
</template>

<script setup>
defineProps(['tabs', 'activeTab'])
defineEmits(['tab-change'])
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.filter-tabs {
  display: flex;
  gap: 20px;  /* 与社区保持一致 */
  border-bottom: 2px solid $border-light;
  padding-bottom: 10px;
  margin-bottom: 20px;

  .tab {
    font-size: 16px;
    font-weight: 500;
    color: $text-regular;
    cursor: pointer;
    padding: 5px 0;
    transition: color 0.3s;

    &:hover {
      color: $primary;
    }

    &.active {
      color: $primary;
      border-bottom: 2px solid $primary;
      margin-bottom: -12px;  /* 与社区保持一致 */
    }
  }
}
</style>