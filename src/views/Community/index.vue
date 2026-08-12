<!-- src/views/Community/index.vue -->
<template>
  <div class="community">
    <NavBar />
    
    <div class="container">
      <!-- 搜索框区域 -->
      <div class="search-section">
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchKeyword" 
            placeholder="搜索帖子、作者或内容..."
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">
            <i class="fas fa-search"></i>
            <span>搜索</span>
          </button>
        </div>
      </div>

      <div class="content-wrapper">
        <div class="main-content">
          <CategoryTabs v-model="activeTab" @update:model-value="handleTabChange" />
          
          <!-- 帖子列表 -->
          <PostList :posts="paginatedPosts" />
          
          <!-- 分页控件 -->
          <div class="pagination" v-if="totalPages > 1">
            <button 
              class="pagination-btn" 
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              <i class="fas fa-chevron-left"></i> 上一页
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
              下一页 <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        
        <Sidebar />
      </div>
    </div>

    <!-- 悬浮发布按钮 - 添加登录检查 -->
    <button class="floating-btn" @click="handlePublishClick">
      <i class="fas fa-pen"></i>
      <span>发布帖子</span>
    </button>

    <!-- 发帖弹窗 - 只有在登录状态下才显示 -->
    <CreatePostModal 
      v-if="isLogin"
      v-model:visible="showModal"
      @post-created="handleNewPost"
    />

    <!-- 回到顶部按钮 -->
    <BackToTop />

    <FooterSection />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/views/Home/components/NavBar.vue'
import FooterSection from '@/views/Home/components/FooterSection.vue'
import BackToTop from './components/BackToTop.vue'
import CreatePostModal from './components/CreatePostModal.vue'
import CategoryTabs from './components/CategoryTabs.vue'
import PostList from './components/PostList.vue'
import Sidebar from './components/Sidebar.vue'

// 导入共享数据
import { communityPosts, addPost, currentUser } from '@/shared/data.js'

const router = useRouter()

// 登录状态 - 从共享数据获取
const isLogin = computed(() => {
  return !!currentUser.value
})

// 弹窗显示状态
const showModal = ref(false)

// 搜索关键词
const searchKeyword = ref('')

// 分页相关 - 每页6条
const currentPage = ref(1)
const pageSize = 6

// 处理发布按钮点击
const handlePublishClick = () => {
  if (!isLogin.value) {
    router.push('/login')
    return
  }
  showModal.value = true
}

// 当前选中的分类
const activeTab = ref('全部')

// 计算过滤后的帖子（根据分类和搜索关键词）
const filteredPosts = computed(() => {
  let result = communityPosts.value
  
  // 按分类过滤
  if (activeTab.value !== '全部') {
    result = result.filter(p => p.category === activeTab.value)
  }
  
  // 按搜索关键词过滤
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase().trim()
    result = result.filter(post => 
      post.title.toLowerCase().includes(keyword) ||
      post.author.toLowerCase().includes(keyword) ||
      (post.summary && post.summary.toLowerCase().includes(keyword)) ||
      (post.content && post.content.toLowerCase().includes(keyword))
    )
  }
  
  return result
})

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(filteredPosts.value.length / pageSize)
})

// 计算当前页显示的帖子
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredPosts.value.slice(start, end)
})

// 计算显示的页码（最多显示5个页码）
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
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// 搜索功能
const handleSearch = () => {
  currentPage.value = 1 // 重置到第一页
}

// 切换分类时重置到第一页
const handleTabChange = () => {
  currentPage.value = 1
}

// 处理新帖子
const handleNewPost = (newPost) => {
  addPost(newPost)  // 使用共享的 addPost 方法
  currentPage.value = 1 // 新帖子发布后回到第一页
  showModal.value = false
}
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.community {
  background: $bg-body;
  min-height: 100vh;
  position: relative;
}

.container {
  width: $container-width;
  margin: 30px auto;
}

// 搜索区域样式
.search-section {
  margin-bottom: 24px;
}

.search-container {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  border-radius: 30px;
  overflow: hidden;
  border: 2px solid $border-light;
  transition: all 0.3s;
  background: white;
  
  &:focus-within {
    border-color: $primary;
    box-shadow: none;
  }
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  border: none;
  outline: none;
  font-size: 16px;
  
  &::placeholder {
    color: $text-placeholder;
  }
}

.search-btn {
  padding: 0 24px;
  background: $primary;
  color: white;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s;
  
  &:hover {
    background: $primary-dark;
  }
  
  i {
    font-size: 14px;
  }
}

.content-wrapper {
  display: flex;
  gap: 30px;
  margin-top: 30px;
}

.main-content {
  flex: 1;
}

// 分页样式
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
  padding: 20px 0;
}

.pagination-btn {
  padding: 8px 16px;
  background: white;
  border: 1px solid $border-light;
  border-radius: 6px;
  color: $text-regular;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;
  box-shadow: none;
  
  &:hover:not(:disabled) {
    border-color: $primary;
    color: $primary;
    box-shadow: none;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  i {
    font-size: 12px;
  }
}

.pagination-pages {
  display: flex;
  gap: 8px;
}

.pagination-page {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid $border-light;
  border-radius: 6px;
  color: $text-regular;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: none;
  
  &:hover {
    border-color: $primary;
    color: $primary;
    box-shadow: none;
  }
  
  &.active {
    background: $primary;
    border-color: $primary;
    color: white;
  }
}

// 悬浮发布按钮
.floating-btn {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: $primary;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 100;
  transition: all 0.3s;
  box-shadow: none;

  i {
    font-size: 18px;
  }

  &:hover {
    background: $primary-dark;
    box-shadow: none;
  }
}

// 手机适配
@media (max-width: 768px) {
  .container {
    width: 100%;
    padding: 0 20px;
  }
  
  .content-wrapper {
    flex-direction: column;
  }
  
  .search-container {
    max-width: 100%;
  }
  
  .search-btn span {
    display: none;
  }
  
  .pagination {
    gap: 10px;
  }
  
  .pagination-page {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
  
  .floating-btn {
    bottom: 20px;
    padding: 12px 24px;
    font-size: 14px;
  }
}
</style>