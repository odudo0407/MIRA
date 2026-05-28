<template>
  <div class="post-list">
    <PostItem 
      v-for="post in posts" 
      :key="post.id"
      :post="post"
    />
  </div>
</template>

<script setup>
import PostItem from './PostItem.vue'

defineProps(['posts'])
</script>