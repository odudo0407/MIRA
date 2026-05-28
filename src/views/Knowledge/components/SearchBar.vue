<!-- src/views/Knowledge/components/SearchBar.vue -->
<template>
  <div class="search-section">
    <h1 class="logo-text">MIRA 题库</h1>
    <div class="search-box">
      <input 
        type="text" 
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        placeholder="搜索面经、八股文、算法题..."
        @keyup.enter="$emit('search')"
      >
      <button @click="$emit('search')">
        <i class="fas fa-search"></i> 搜索
      </button>
    </div>
    <div class="hot-searches">
      <span class="hot-label">热门：</span>
      <a href="javascript:;" @click="$emit('hot-search', 'Vue3')">Vue3</a>
      <a href="javascript:;" @click="$emit('hot-search', '闭包')">闭包</a>
      <a href="javascript:;" @click="$emit('hot-search', '面经')">面经</a>
      <a href="javascript:;" @click="$emit('hot-search', '二叉树')">二叉树</a>
      <a href="javascript:;" @click="$emit('hot-search', '浏览器渲染')">浏览器渲染</a>
    </div>
  </div>
</template>

<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue', 'search', 'hot-search'])
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.search-section {
  text-align: center;
  margin: 25px 0 30px;  /* 稍微增加上下边距 */

  .logo-text {
    font-size: 36px;  /* 恢复原来的大小 */
    font-weight: 700;
    background: linear-gradient(135deg, $primary, $secondary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 25px;  /* 介于20-30之间 */
    letter-spacing: -0.5px;
  }

  .search-box {
    display: flex;
    max-width: 580px;  /* 介于560-600之间 */
    margin: 0 auto 15px;  /* 恢复原来的下边距 */
    border: 2px solid $border-color;
    border-radius: 30px;
    overflow: hidden;
    transition: all 0.3s;

    &:focus-within {
      border-color: $primary;
    }

    input {
      flex: 1;
      padding: 14px 20px;  /* 介于12-15之间 */
      border: none;
      outline: none;
      font-size: 16px;  /* 恢复原来大小 */
    }

    button {
      padding: 0 28px;  /* 介于24-30之间 */
      background: $primary;
      color: white;
      border: none;
      cursor: pointer;
      font-size: 16px;  /* 恢复原来大小 */
      transition: background 0.3s;

      &:hover {
        background: $primary-dark;
      }

      i {
        font-size: 15px;
        margin-right: 4px;
      }
    }
  }

  .hot-searches {
    color: $text-regular;
    font-size: 14px;  /* 恢复原来大小 */

    .hot-label {
      color: $text-secondary;
      margin-right: 8px;
    }

    a {
      color: $text-regular;
      text-decoration: none;
      margin: 0 8px;  /* 恢复原来间距 */
      transition: color 0.3s;

      &:hover {
        color: $primary;
      }
    }
  }
}
</style>