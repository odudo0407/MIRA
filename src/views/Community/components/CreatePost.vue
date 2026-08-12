<template>
  <div class="create-post">
    <input 
      v-model="form.title" 
      placeholder="输入帖子标题..."
      class="title-input"
    >
    
    <textarea 
      v-model="form.content" 
      placeholder="分享你的面经、问题或吐槽..."
      rows="3"
    ></textarea>
    
    <div class="form-actions">
      <div class="left">
        <input v-model="form.author" placeholder="昵称" class="author-input">
        <select v-model="form.category" class="category-select">
          <option value="面经分享">面经分享</option>
          <option value="技术问答">技术问答</option>
          <option value="求职吐槽">求职吐槽</option>
          <option value="资源推荐">资源推荐</option>
        </select>
      </div>
      <button @click="submitPost" :disabled="!canPost">发布帖子</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['post-created'])

const form = ref({
  title: '',
  author: '',
  content: '',
  category: '面经分享'
})

const canPost = computed(() => {
  return form.value.title.trim() && form.value.author.trim() && form.value.content.trim()
})

const submitPost = () => {
  const newPost = {
    id: Date.now(),
    title: form.value.title,
    author: form.value.author,
    time: Date.now(),
    summary: form.value.content.slice(0, 100) + (form.value.content.length > 100 ? '...' : ''),
    content: form.value.content,
    views: 0,
    likes: 0,
    replies: 0,
    category: form.value.category,
    avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random()*100)}.jpg`
  }
  
  emit('post-created', newPost)
  
  form.value.title = ''
  form.value.author = ''
  form.value.content = ''
  form.value.category = '面经分享'
}
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.create-post {
  background: $white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  
  .title-input {
    width: 100%;
    padding: 12px;
    border: 1px solid $border-color;
    border-radius: 8px;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 500;
    
    &:focus {
      outline: none;
      border-color: $primary;
    }
  }
  
  textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid $border-color;
    border-radius: 8px;
    resize: vertical;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: $primary;
    }
  }
  
  .form-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    
    .left {
      display: flex;
      gap: 10px;
    }
    
    .author-input, .category-select {
      padding: 8px 12px;
      border: 1px solid $border-color;
      border-radius: 8px;
      font-size: 14px;
      
      &:focus {
        outline: none;
        border-color: $primary;
      }
    }
    
    .author-input {
      width: 120px;
    }
    
    button {
      background: $primary;
      color: white;
      border: none;
      padding: 8px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
      
      &:hover {
        background: $primary-dark;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba($primary, 0.3);
      }
      
      &:disabled {
        background: $text-placeholder;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
    }
  }
}
</style>