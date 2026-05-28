<template>
  <nav class="navbar">
    <div class="nav-container">
      <!-- 修改这里：把图标+文字换成图片 -->
      <div class="logo" @click="router.push('/')">
        <img src="@/assets/images/logo.png" alt="MIRA" class="logo-img">
        <!-- 如果还想保留文字，可以取消下面这行的注释 -->
        <!-- <span>MIRA</span> -->
      </div>
      
      <!-- 中间导航组 -->
      <div class="nav-center">
        <router-link to="/" class="nav-center-link">首页</router-link>
		     <router-link to="/interview" class="nav-center-link">模拟面试</router-link>
        <router-link to="/community" class="nav-center-link">社区</router-link>
        <router-link to="/knowledge" class="nav-center-link">题库</router-link>
        <router-link to="/chat" class="nav-center-link">AI助手</router-link>
      </div>
      
      <!-- 右边区域 - 头像下拉菜单（这部分保持不变） -->
      <div class="nav-right">
        <!-- 未登录：显示默认头像，点击跳转登录页 -->
        <div v-if="!isLogin" class="avatar-container" @click="router.push('/login')">
          <img :src="defaultAvatar" alt="默认头像" class="avatar">
        </div>
        
        <!-- 已登录：显示用户头像 + 下拉菜单 -->
        <div v-else class="user-menu" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
          <div class="avatar-container">
            <img :src="user?.avatar || defaultAvatar" :alt="user?.name" class="avatar">
            <i class="fas fa-chevron-down" :class="{ rotate: showDropdown }"></i>
            <!-- 小红点提示 -->
            <span v-if="hasUpdates" class="update-dot"></span>
          </div>
          
          <!-- 下拉菜单 -->
          <div v-show="showDropdown" class="dropdown">
            <div class="dropdown-item" @click="router.push('/profile')">
              <i class="fas fa-user"></i> 个人中心
              <span v-if="hasUpdates" class="menu-badge">●</span>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-item logout" @click="logout">
              <i class="fas fa-sign-out-alt"></i> 退出登录
            </div>
          </div>
        </div>
        
        <button @click="$emit('toggle-menu')" class="menu-btn">
          <i :class="mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
        </button>
      </div>
    </div>
    
    <!-- 移动端菜单（这部分保持不变） -->
    <div v-show="mobileMenuOpen" class="mobile-menu">
      <!-- 移动端用户信息 -->
      <div v-if="isLogin" class="mobile-user">
        <img :src="user?.avatar || defaultAvatar" alt="" class="mobile-avatar">
        <span class="mobile-username">{{ user?.name }}</span>
        <span v-if="hasUpdates" class="mobile-badge">有新动态</span>
      </div>
      <div v-else class="mobile-user">
        <router-link to="/login" @click="$emit('toggle-menu')">登录/注册</router-link>
      </div>
      
      <!-- 移动端导航链接 -->
      <router-link to="/" @click="$emit('toggle-menu')">首页</router-link>
      <router-link to="/community" @click="$emit('toggle-menu')">社区</router-link>
      <router-link to="/knowledge" @click="$emit('toggle-menu')">题库</router-link>
      <router-link to="/interview" @click="$emit('toggle-menu')">模拟面试</router-link>
      <router-link to="/chat" @click="$emit('toggle-menu')">AI助手</router-link>
      
      <!-- 移动端个人中心链接（已登录时显示） -->
      <template v-if="isLogin">
        <div class="mobile-divider"></div>
        <router-link to="/profile" @click="$emit('toggle-menu')">
          <i class="fas fa-user"></i> 个人中心
          <span v-if="hasUpdates" class="mobile-badge">●</span>
        </router-link>
        <a href="#" @click="logout; $emit('toggle-menu')">
          <i class="fas fa-sign-out-alt"></i> 退出登录
        </a>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { communityPosts } from '@/shared/data.js'
import { currentUser, updateUser } from '@/shared/data.js' 

defineProps({
  mobileMenuOpen: Boolean
})
defineEmits(['toggle-menu'])

const route = useRoute()
const router = useRouter()
const isHomePage = route.path === '/'

// 用户状态 - 直接从共享数据获取
const user = currentUser
const showDropdown = ref(false)

// 计算是否登录
const isLogin = computed(() => user.value !== null)

// 计算是否有更新（模拟：检查用户的帖子是否有新回复）
const hasUpdates = computed(() => {
  if (!user.value) return false
  
  // 这里可以添加真实的更新检查逻辑
  // 比如检查用户的帖子是否有新回复、新点赞等
  const userPosts = communityPosts.value.filter(p => p.author === user.value?.name)
  return userPosts.some(p => p.replies > 0) // 示例：有回复就显示红点
})

// 退出登录
const logout = () => {
  updateUser(null)  // 使用 updateUser 清空用户
  showDropdown.value = false
  router.push('/')
}

// 默认头像 - 改为本地图片
const defaultAvatar = '/src/assets/images/user.png'
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';
@import '@/styles/mixins.scss';

.navbar {
  @include backdrop-blur;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 30;
  border-bottom: 1px solid $border-light;

  .nav-container {
    width: $container-width;
    margin: 0 auto;
    padding: 0.8rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    box-sizing: border-box;
  }

  /* 修改这里：logo 样式调整 */
  .logo {
    display: flex;
    align-items: center;
    cursor: pointer;
    width: 100px;
	  margin-left: 80px;

    .logo-img {
      height: 50px;        /* 根据你的logo大小调整 */
      width: auto;
      object-fit: contain;
    }
  }

  .nav-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 2rem;
    white-space: nowrap;

    .nav-center-link {
      color: $text-primary;
      font-weight: 500;
      text-decoration: none;
      padding: 0.5rem 0;
      position: relative;
      transition: color 0.3s;
      font-size: 0.95rem;

      &:hover {
        color: $primary;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: $primary;
          border-radius: 2px;
        }
      }

      &.router-link-active {
        color: $primary;
        font-weight: 600;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: $primary;
          border-radius: 2px;
        }
      }
    }
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100px;
    justify-content: flex-end;
  }

  // 头像容器
  .avatar-container {
    position: relative;
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    padding: 4px;
    border-radius: 30px;
    transition: background 0.3s;

    &:hover {
      background: rgba($primary, 0.1);
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid transparent;
      transition: border-color 0.3s;
    }

    .fa-chevron-down {
      font-size: 12px;
      color: $text-regular;
      transition: transform 0.3s;
      
      &.rotate {
        transform: rotate(180deg);
      }
    }
  }

  // 小红点
  .update-dot {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 10px;
    height: 10px;
    background: $danger;
    border-radius: 50%;
    border: 2px solid white;
  }

  // 用户菜单
  .user-menu {
    position: relative;
  }

  // 下拉菜单
  .dropdown {
    position: absolute;
    top: 45px;
    right: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    min-width: 160px;
    z-index: 100;
    overflow: hidden;
    animation: fadeIn 0.2s ease;

    .dropdown-item {
      padding: 12px 16px;
      color: $text-regular;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.2s;
      position: relative;

      i {
        width: 16px;
        font-size: 14px;
        color: $text-secondary;
      }

      .menu-badge {
        margin-left: auto;
        color: $danger;
        font-size: 12px;
      }

      &:hover {
        background: $bg-gray;
        color: $primary;

        i {
          color: $primary;
        }
      }

      &.logout {
        color: $danger;
        
        i {
          color: $danger;
        }

        &:hover {
          background: rgba($danger, 0.1);
        }
      }
    }

    .dropdown-divider {
      height: 1px;
      background: $border-light;
      margin: 4px 0;
    }
  }

  .menu-btn {
    display: none;
    color: $text-regular;
    font-size: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
  }

  .mobile-menu {
    display: none;
    padding: 1rem;
    background: white;
    border-top: 1px solid $border-light;
    max-height: calc(100vh - 60px);
    overflow-y: auto;

    .mobile-user {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 1rem;
      margin-bottom: 8px;
      border-bottom: 1px solid $border-light;

      .mobile-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
      }

      .mobile-username {
        color: $text-primary;
        font-weight: 500;
      }

      .mobile-badge {
        margin-left: auto;
        color: $danger;
        font-size: 12px;
        background: rgba($danger, 0.1);
        padding: 2px 8px;
        border-radius: 12px;
      }

      a {
        color: $primary;
        text-decoration: none;
        font-weight: 500;
      }
    }

    a, .router-link {
      display: block;
      padding: 12px 1rem;
      color: $text-regular;
      text-decoration: none;
      transition: all 0.2s;
      position: relative;
      
      i {
        width: 20px;
        margin-right: 8px;
        color: $text-secondary;
      }

      .mobile-badge {
        margin-left: 8px;
        color: $danger;
        font-size: 12px;
      }
      
      &:hover {
        color: $primary;
        background: $bg-gray;

        i {
          color: $primary;
        }
      }
    }

    .mobile-divider {
      height: 1px;
      background: $border-light;
      margin: 8px 0;
    }
  }
}

// 动画
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 响应式
@media (max-width: 768px) {
  .nav-center {
    display: none;
  }
  
  .menu-btn {
    display: block !important;
  }
  
  .mobile-menu {
    display: block;
  }

  .nav-right {
    width: auto;
  }
}
</style>