<!-- src/views/Knowledge/index.vue -->
<template>
  <div class="knowledge">
    <NavBar />
    
    <div class="container">
      <SearchBar 
        v-model="searchKeyword" 
        @search="handleSearch"
        @hot-search="handleHotSearch"
      />
      
      <div class="content-section">
        <FilterTabs 
          :tabs="tabs"
          :active-tab="activeTab"
          @tab-change="handleTabChange"
        />

        <div class="result-stats" v-if="searchKeyword">
          找到约 {{ filteredItems.length }} 条结果
        </div>

        <div class="article-list">
          <ArticleCard 
            v-for="item in paginatedItems" 
            :key="item.id"
            :article="item"
          />
        </div>

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
    </div>

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
import SearchBar from './components/SearchBar.vue'
import FilterTabs from './components/FilterTabs.vue'
import ArticleCard from './components/ArticleCard.vue'

const router = useRouter()

const searchKeyword = ref('')
const activeTab = ref('全部')
const currentPage = ref(1)
const pageSize = 6

const tabs = ['全部', '面经', '八股文', '算法题', 'JavaScript', 'Vue', 'React', '网络']

const allItems = ref([
  {
    id: 1,
    title: '字节跳动前端一面面经（已拿offer）',
    summary: '刚面完字节前端岗，热乎的面经！一面主要问了：Vue3响应式原理、闭包应用、算法题两数之和、项目经验...',
    content: '完整文章内容...',
    author: '前端小王子',
    views: 1234,
    likes: 89,
    comments: 12,
    date: '2024-03-15',
    tags: ['面经', '字节', '一面'],
    category: '面经',
    readTime: '8分钟'
  },
  {
    id: 2,
    title: 'Vue3响应式原理详解（附源码分析）',
    summary: '深入解析Vue3的响应式系统，从Proxy到Reflect，手写mini版响应式源码...',
    content: '完整文章内容...',
    author: '源码猎人',
    views: 856,
    likes: 34,
    comments: 23,
    date: '2024-03-10',
    tags: ['Vue3', '源码', '进阶'],
    category: 'Vue',
    readTime: '15分钟'
  },
  {
    id: 3,
    title: '前端必刷算法题：二叉树遍历',
    summary: '二叉树的前序、中序、后序、层序遍历，递归与非递归实现，附LeetCode题解...',
    content: '完整文章内容...',
    author: '算法大师',
    views: 2341,
    likes: 156,
    comments: 45,
    date: '2024-03-05',
    tags: ['算法', '二叉树', 'LeetCode'],
    category: '算法题',
    readTime: '12分钟'
  },
  {
    id: 4,
    title: 'JavaScript闭包在实际开发中的应用',
    summary: '闭包不只是面试题！实际项目中的应用场景：防抖节流、模块化、循环绑定...',
    content: '完整文章内容...',
    author: 'JS专家',
    views: 567,
    likes: 23,
    comments: 8,
    date: '2024-03-01',
    tags: ['JavaScript', '闭包', '进阶'],
    category: 'JavaScript',
    readTime: '6分钟'
  },
  {
    id: 5,
    title: '浏览器渲染原理：从输入URL到页面显示',
    summary: '完整解析浏览器渲染流程：DNS解析、TCP连接、HTTP请求、构建DOM树、渲染树...',
    content: '完整文章内容...',
    author: '性能优化专家',
    views: 1890,
    likes: 98,
    comments: 34,
    date: '2024-02-28',
    tags: ['浏览器', '渲染', '性能'],
    category: '网络',
    readTime: '10分钟'
  },
  {
    id: 6,
    title: 'React Hooks原理与最佳实践',
    summary: 'useState、useEffect、useMemo等Hooks的实现原理，以及实际项目中的使用技巧...',
    content: '完整文章内容...',
    author: 'React大神',
    views: 2345,
    likes: 167,
    comments: 56,
    date: '2024-02-25',
    tags: ['React', 'Hooks', '实战'],
    category: 'React',
    readTime: '12分钟'
  },
  {
    id: 7,
    title: '阿里P7面试题汇总',
    summary: '收集了阿里P7级别的面试题，附答案解析...',
    content: '完整文章内容...',
    author: '面试达人',
    views: 432,
    likes: 45,
    comments: 12,
    date: '5天前',
    tags: ['面经', '阿里', 'P7'],
    category: '面经',
    readTime: '12分钟'
  }
])

// 计算过滤后的文章
const filteredItems = computed(() => {
  let items = allItems.value
  
  if (activeTab.value !== '全部') {
    items = items.filter(item => item.category === activeTab.value)
  }
  
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()
    items = items.filter(item => 
      item.title.toLowerCase().includes(keyword) ||
      item.summary.toLowerCase().includes(keyword) ||
      item.tags.some(tag => tag.toLowerCase().includes(keyword))
    )
  }
  
  return items
})

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / pageSize)
})

// 计算当前页显示的文章
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredItems.value.slice(start, end)
})

// 计算显示的页码（最多显示5个）
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
}

// 处理热门搜索
const handleHotSearch = (keyword) => {
  searchKeyword.value = keyword
  currentPage.value = 1
}

// 切换分类
const handleTabChange = (tab) => {
  activeTab.value = tab
  currentPage.value = 1
}
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.knowledge {
  background: $bg-body;
  min-height: 100vh;
  position: relative;
}

.container {
  width: $container-width;
  margin: 0 auto;
  padding: 30px 0;
}

.content-section {
  margin-top: 30px;
}

.result-stats {
  color: $text-secondary;
  font-size: 14px;
  margin: 20px 0;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 40px;
}

// 分页样式（与社区一致）
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
  
  &:hover:not(:disabled) {
    border-color: $primary;
    color: $primary;
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

// 手机适配
@media (max-width: 768px) {
  .container {
    width: 100%;
    padding: 0 20px;
  }

  .pagination {
    gap: 10px;
  }

  .pagination-page {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
}
</style>