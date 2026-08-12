<!-- src/views/Community/components/PostItem.vue -->
<template>
  <div class="post-item" @click="openInNewTab">
    <div class="post-avatar">
      <img :src="post.avatar" alt="">
    </div>
    
    <div class="post-content">
      <div class="post-header">
        <h3 class="post-title">
          <!-- 修改这里：添加 target="_blank" 在新页面打开 -->
          <router-link :to="`/community/post/${post.id}`" target="_blank" @click.stop>
            {{ post.title }}
          </router-link>
        </h3>
        <span class="post-time">{{ formatTime(post.time) }}</span>
      </div>
      
      <p class="post-summary">{{ post.summary || post.content?.slice(0, 100) + '...' }}</p>
      
      <div class="post-footer">
        <div class="left">
          <span class="post-author">{{ post.author }}</span>
          <span class="post-category">{{ post.category }}</span>
        </div>
        <div class="post-stats">
          <span>
            <img src="@/assets/images/eye.png" alt="浏览" class="stat-icon">
            {{ post.views }}
          </span>
          <span>
            <img src="@/assets/images/message.png" alt="回复" class="stat-icon">
            {{ post.replies }}
          </span>
          <span>
            <img src="@/assets/images/like.png" alt="点赞" class="stat-icon">
            {{ post.likes }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps(['post'])
const router = useRouter()

const formatTime = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  return Math.floor(diff / 86400000) + '天前'
}

// 整个卡片点击时在新标签页打开
const openInNewTab = () => {
  const url = router.resolve(`/community/post/${props.post.id}`).href
  window.open(url, '_blank')
}
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.post-item {
  display: flex;
  gap: 20px;
  background: $white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid $border-light; /* 添加边框替代阴影 */
  transition: all 0.3s;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    border-color: $primary; /* 悬停时边框变色 */
  }
}

.post-avatar {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
}

.post-content {
  flex: 1;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.post-title {
  font-size: 18px;
  font-weight: 600;
  
  a {
    color: $text-primary;
    text-decoration: none;

  }
}

.post-time {
  color: $text-secondary;
  font-size: 14px;
}

.post-summary {
  color: $text-regular;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 10px;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .left {
    display: flex;
    gap: 15px;
  }
  
  .post-author {
    color: $primary;
    font-weight: 500;
    font-size: 14px;
  }
  
  .post-category {
    color: $text-secondary;
    font-size: 12px;
    background: $bg-gray;
    padding: 2px 8px;
    border-radius: 4px;
  }
}

.post-stats {
  display: flex;
  gap: 15px;
  color: $text-secondary;
  font-size: 14px;
  
  /* 图标样式 */
  .stat-icon {
    width: 16px;
    height: 16px;
    margin-right: 4px;
    vertical-align: middle;
    object-fit: contain;
  }
}
</style>