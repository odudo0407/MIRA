<template>
  <div class="profile-posts">
    <div class="page-header">
      <h2>我的帖子</h2>
      <span class="count">共 {{ myPosts.length }} 篇</span>
    </div>

    <div v-if="myPosts.length === 0" class="empty-state">
      <i class="fas fa-file-alt"></i>
      <p>还没有发布过帖子</p>
      <router-link to="/community" class="go-btn">去社区发布</router-link>
    </div>

    <div v-else class="posts-list">
      <div v-for="post in paginatedPosts" :key="post.id" class="post-item">
        <div class="post-info" @click="goToPost(post.id)">
          <h3 class="post-title">{{ post.title }}</h3>
          <div class="post-meta">
            <span class="time">{{ formatTime(post.time) }}</span>
            <span class="stats">
              <img src="@/assets/images/eye.png" alt="浏览" class="stat-icon">
              {{ post.views }}
              <img src="@/assets/images/message.png" alt="回复" class="stat-icon">
              {{ post.replies }}
              <img src="@/assets/images/like.png" alt="点赞" class="stat-icon">
              {{ post.likes }}
            </span>
          </div>
        </div>
        <div class="post-actions">
          <button class="action-btn delete" @click="handleDelete(post.id)">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="totalPages > 1">
        <button 
          class="pagination-btn" 
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        
        <div class="pagination-pages">
          <button 
            v-for="page in displayedPages" 
            :key="page"
            class="pagination-page" 
            :class="{ active: currentPage === page }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          class="pagination-btn" 
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { communityPosts, deletePost, currentUser } from '@/shared/data.js'

const router = useRouter()

// 分页
const currentPage = ref(1)
const pageSize = 10

// 当前用户的帖子
const myPosts = computed(() => {
  if (!currentUser.value) return []
  return communityPosts.value.filter(p => p.author === currentUser.value.name)
})

// 分页后的帖子
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return myPosts.value.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(myPosts.value.length / pageSize)
})

// 显示的页码
const displayedPages = computed(() => {
  const pages = []
  let start = Math.max(1, currentPage.value - 2)
  let end = Math.min(totalPages.value, start + 4)
  
  if (end - start < 4) {
    start = Math.max(1, end - 4)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// 切换页码
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// 跳转到帖子详情
const goToPost = (id) => {
  window.open(`/community/post/${id}`, '_blank')
}

// 删除帖子
const handleDelete = (id) => {
  if (confirm('确定要删除这篇帖子吗？')) {
    deletePost(id)
    // 如果删除后当前页没有数据了，回到上一页
    if (paginatedPosts.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }
  }
}

// 格式化时间
const formatTime = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  return Math.floor(diff / 86400000) + '天前'
}
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.profile-posts {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid $border-light;

    h2 {
      color: $text-primary;
      font-size: 20px;
      font-weight: 600;
    }

    .count {
      color: $text-secondary;
      font-size: 14px;
    }
  }

  .empty-state {
    text-align: center;
    padding: 60px 0;

    i {
      font-size: 48px;
      color: $text-placeholder;
      margin-bottom: 16px;
    }

    p {
      color: $text-regular;
      margin-bottom: 20px;
    }

    .go-btn {
      display: inline-block;
      padding: 10px 24px;
      background: $primary;
      color: white;
      text-decoration: none;
      border-radius: 30px;
      font-size: 14px;
      
      &:hover {
        background: $primary-dark;
      }
    }
  }

  .posts-list {
    .post-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border: 1px solid $border-light;
      border-radius: 8px;
      margin-bottom: 12px;
      transition: all 0.3s;

      &:hover {
        border-color: $primary;
      }

      .post-info {
        flex: 1;
        cursor: pointer;
      }

      .post-title {
        color: $text-primary;
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 8px;
      }

      .post-meta {
        display: flex;
        gap: 20px;
        color: $text-secondary;
        font-size: 13px;

        .stats {
          display: flex;
          gap: 12px;

          .stat-icon {
            width: 14px;
            height: 14px;
            margin-right: 2px;
            vertical-align: middle;
          }
        }
      }

      .post-actions {
        display: flex;
        gap: 8px;

        .action-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          background: transparent;
          color: $text-regular;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;

          &:hover {
            background: $bg-gray;
          }

          &.delete:hover {
            color: $danger;
            background: rgba($danger, 0.1);
          }
        }
      }
    }
  }

  // 分页样式
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 30px;

    .pagination-btn {
      width: 36px;
      height: 36px;
      border: 1px solid $border-light;
      border-radius: 6px;
      background: white;
      color: $text-regular;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover:not(:disabled) {
        border-color: $primary;
        color: $primary;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .pagination-pages {
      display: flex;
      gap: 8px;
    }

    .pagination-page {
      width: 36px;
      height: 36px;
      border: 1px solid $border-light;
      border-radius: 6px;
      background: white;
      color: $text-regular;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        border-color: $primary;
        color: $primary;
      }

      &.active {
        background: $primary;
        border-color: $primary;
        color: white;
      }
    }
  }
}
</style>