<!-- src/views/Community/components/Sidebar.vue -->
<template>
  <div class="sidebar">
    <div class="widget announcement">
      <h3>社区公告</h3>
      <p>欢迎来到MIRA社区！请友善交流，共同进步。</p>
    </div>
    
    <div class="widget hot-posts">
      <h3>热门帖子</h3>
      <div v-for="post in hotPosts" :key="post.id" class="hot-item">
        <router-link :to="`/community/post/${post.id}`" target="_blank">
          {{ post.title }}
        </router-link>
        <span class="views">{{ post.views }} 浏览</span>
      </div>
    </div>
    
    <div class="widget active-users">
      <h3>活跃用户</h3>
      <div v-for="user in activeUsers" :key="user.id" class="user-item">
        <img :src="user.avatar" alt="">
        <span>{{ user.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const hotPosts = ref([
  { id: 1, title: '字节跳动前端一面面经', views: 1234 },
  { id: 2, title: 'Vue3响应式原理详解', views: 987 },
  { id: 3, title: '2024前端学习路线图', views: 876 },
  { id: 4, title: '面试官最爱问的闭包', views: 765 }
])

const activeUsers = ref([
  { id: 1, name: '前端小王子', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: 2, name: '代码女侠', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: 3, name: '面试收割机', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: 4, name: '资源君', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' }
])
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.sidebar {
  width: 280px;
  flex-shrink: 0;
}

.widget {
  background: $white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid $border-light; /* 添加边框替代阴影 */
  
  h3 {
    font-size: 16px;
    color: $text-primary;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid $border-light;
  }
}

.announcement {
  p {
    color: $text-regular;
    font-size: 14px;
    line-height: 1.6;
  }
}

.hot-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  
  a {
    color: $text-regular;
    font-size: 14px;
    text-decoration: none;
    flex: 1;
    
    &:hover {
      color: $primary;
    }
  }
  
  .views {
    color: $text-secondary;
    font-size: 12px;
    margin-left: 10px;
  }
}

.user-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  
  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  span {
    color: $text-regular;
    font-size: 14px;
  }
}
</style>