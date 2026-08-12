<template>
  <div class="profile-favorites">
    <div class="page-header">
      <h2>我的收藏</h2>
      <span class="count">共 {{ myFavorites.length }} 个</span>
    </div>

    <!-- 分类标签 -->
    <div class="favorite-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.value"
        class="tab"
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="filteredFavorites.length === 0" class="empty-state">
      <i class="fas fa-heart"></i>
      <p>还没有收藏内容</p>
      <router-link to="/community" class="go-btn">去社区看看</router-link>
    </div>

    <div v-else class="favorites-list">
      <div v-for="item in paginatedFavorites" :key="item.id" class="favorite-item">
        <div class="favorite-info" @click="goToTarget(item)">
          <h3 class="favorite-title">{{ item.title }}</h3>
          <div class="favorite-meta">
            <span class="author">{{ item.author }}</span>
            <span class="date">· {{ item.date }}</span>
          </div>
        </div>
        <button class="delete-btn" @click="handleDelete(item)">
          <i class="fas fa-times"></i>
        </button>
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
import { userFavorites, removeFavorite, currentUser } from '@/shared/data.js'

const router = useRouter()

// 分类标签
const tabs = [
  { label: '全部', value: 'all' },
  { label: '帖子', value: 'post' },
  { label: '文章', value: 'article' }
]
const activeTab = ref('all')

// 分页
const currentPage = ref(1)
const pageSize = 10

// 当前用户的收藏
const myFavorites = computed(() => {
  if (!currentUser.value) return []
  return userFavorites.value.filter(f => f.userId === currentUser.value.id)
})

// 根据分类过滤
const filteredFavorites = computed(() => {
  if (activeTab.value === 'all') return myFavorites.value
  return myFavorites.value.filter(f => f.type === activeTab.value)
})

// 分页后的收藏
const paginatedFavorites = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredFavorites.value.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredFavorites.value.length / pageSize)
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

// 跳转到收藏内容
const goToTarget = (item) => {
  if (item.type === 'post') {
    window.open(`/community/post/${item.targetId}`, '_blank')
  } else if (item.type === 'article') {
    window.open(`/knowledge/article/${item.targetId}`, '_blank')
  }
}

// 删除收藏
const handleDelete = (item) => {
  if (!currentUser.value) return
  if (confirm('确定要取消收藏吗？')) {
    removeFavorite(currentUser.value.id, item.type, item.targetId)
    // 如果删除后当前页没有数据了，回到上一页
    if (paginatedFavorites.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.profile-favorites {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
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

  .favorite-tabs {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;

    .tab {
      padding: 6px 0;
      background: transparent;
      border: none;
      color: $text-regular;
      font-size: 14px;
      cursor: pointer;
      position: relative;

      &:hover {
        color: $primary;
      }

      &.active {
        color: $primary;
        font-weight: 500;

        &::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 100%;
          height: 2px;
          background: $primary;
        }
      }
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

  .favorites-list {
    .favorite-item {
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

        .favorite-title {
          color: $primary;
        }
      }

      .favorite-info {
        flex: 1;
        cursor: pointer;
      }

      .favorite-title {
        color: $text-primary;
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 6px;
        transition: color 0.3s;
      }

      .favorite-meta {
        color: $text-secondary;
        font-size: 13px;

        .date {
          margin-left: 4px;
        }
      }

      .delete-btn {
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
          color: $danger;
          background: rgba($danger, 0.1);
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