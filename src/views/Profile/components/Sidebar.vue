<template>
  <div class="profile-sidebar">
    <!-- 用户信息卡片 -->
    <div class="user-card">
      <img :src="userAvatar" alt="" class="avatar">
      <h3>{{ userInfo?.name || '未登录' }}</h3>
      <p class="user-email" v-if="userInfo?.email">{{ userInfo.email }}</p>
      <p class="user-email" v-else>请先登录</p>
    </div>
    
    <!-- 菜单导航 -->
    <nav class="menu-nav">
      <router-link to="/profile/posts" class="menu-item" :class="{ active: isActive('/profile/posts') }">
        <i class="fas fa-file-alt"></i>
        <span>我的帖子</span>
        <span class="badge">{{ userPostsCount }}</span>
      </router-link>
      
      <router-link to="/profile/favorites" class="menu-item" :class="{ active: isActive('/profile/favorites') }">
        <i class="fas fa-heart"></i>
        <span>我的收藏</span>
        <span class="badge">{{ userFavoritesCount }}</span>
      </router-link>
      
      <router-link to="/profile/interviews" class="menu-item" :class="{ active: isActive('/profile/interviews') }">
        <i class="fas fa-video"></i>
        <span>面试记录</span>
        <span class="badge">{{ userInterviewsCount }}</span>
      </router-link>
      
      <router-link to="/profile/settings" class="menu-item" :class="{ active: isActive('/profile/settings') }">
        <i class="fas fa-cog"></i>
        <span>账户设置</span>
      </router-link>
      
      <div class="menu-divider"></div>
      
      <button class="menu-item logout" @click="handleLogout">
        <i class="fas fa-sign-out-alt"></i>
        <span>退出登录</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { currentUser, communityPosts, userFavorites, interviewRecords } from '@/shared/data.js'

const route = useRoute()
const router = useRouter()

// 用户信息
const userInfo = computed(() => currentUser.value)
const userAvatar = computed(() => userInfo.value?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg')

// 统计数据
const userPostsCount = computed(() => {
  if (!userInfo.value) return 0
  return communityPosts.value.filter(p => p.author === userInfo.value.name).length
})

const userFavoritesCount = computed(() => {
  if (!userInfo.value) return 0
  return userFavorites.value.filter(f => f.userId === userInfo.value.id).length
})

const userInterviewsCount = computed(() => {
  return interviewRecords.value.length
})

// 判断当前路由是否激活
const isActive = (path) => {
  return route.path === path
}

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('user')
  currentUser.value = null
  router.push('/')
}
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.profile-sidebar {
  width: 260px;
  background: $white;
  border-radius: 12px;
  border: 1px solid $border-light;
  padding: 20px 0;
  height: fit-content;
}

.user-card {
  text-align: center;
  padding: 20px;
  border-bottom: 1px solid $border-light;

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 12px;
  }

  h3 {
    color: $text-primary;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .user-email {
    color: $text-secondary;
    font-size: 13px;
    word-break: break-all;
  }
}

.menu-nav {
  padding: 20px 0;

  .menu-item {
    display: flex;
    align-items: center;
    padding: 12px 24px;
    color: $text-regular;
    text-decoration: none;
    transition: all 0.3s;
    width: 100%;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 14px;

    i {
      width: 20px;
      margin-right: 12px;
      font-size: 16px;
    }

    .badge {
      margin-left: auto;
      background: $bg-gray;
      color: $text-secondary;
      padding: 2px 6px;
      border-radius: 10px;
      font-size: 11px;
    }

    &:hover {
      background: rgba($primary, 0.05);
      color: $primary;
    }

    &.active {
      background: rgba($primary, 0.1);
      color: $primary;
      font-weight: 500;
      border-left: 3px solid $primary;
    }

    &.logout {
      color: $danger;
      
      &:hover {
        background: rgba($danger, 0.05);
      }
    }
  }

  .menu-divider {
    height: 1px;
    background: $border-light;
    margin: 16px 0;
  }
}

// 手机适配
@media (max-width: 768px) {
  .profile-sidebar {
    width: 100%;
  }
}
</style>