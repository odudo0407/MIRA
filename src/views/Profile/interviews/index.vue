<template>
  <div class="profile-interviews">
    <div class="page-header">
      <h2>面试记录</h2>
      <span class="count">共 {{ interviewRecords.length }} 场</span>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-value">{{ interviewRecords.length }}</div>
        <div class="stat-label">总面试场次</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ averageScore }}</div>
        <div class="stat-label">平均得分</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ bestScore }}</div>
        <div class="stat-label">最高得分</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ totalDuration }}</div>
        <div class="stat-label">累计时长(分钟)</div>
      </div>
    </div>

    <!-- 筛选 -->
    <div class="filter-bar">
      <select v-model="typeFilter" class="filter-select">
        <option value="all">全部类型</option>
        <option value="video">视频面试</option>
        <option value="text">文字面试</option>
      </select>
    </div>

    <div v-if="filteredRecords.length === 0" class="empty-state">
      <i class="fas fa-video"></i>
      <p>还没有面试记录</p>
      <router-link to="/interview" class="go-btn">去模拟面试</router-link>
    </div>

    <div v-else class="interviews-list">
      <div v-for="record in paginatedRecords" :key="record.id" class="interview-card" @click="goToDetail(record.id)">
        <div class="card-header">
          <span class="interview-type" :class="record.type">
            {{ record.type === 'video' ? '视频面试' : '文字面试' }}
          </span>
          <span class="interview-date">{{ record.date }} {{ record.time }}</span>
        </div>
        
        <h3 class="interview-topic">{{ record.topic }}</h3>
        
        <div class="interview-tags">
          <span v-for="tag in record.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
        
        <div class="interview-stats">
          <div class="rating">
            <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= Math.floor(record.score) }">
              ★
            </span>
            <span class="score">{{ record.score }}/5</span>
          </div>
          <div class="stats">
            <span>{{ record.duration }}分钟</span>
            <span>·</span>
            <span>{{ record.rounds }}轮对话</span>
          </div>
        </div>

        <div class="card-footer">
          <button class="action-btn" @click.stop="goToDetail(record.id)">
            <i class="fas fa-chart-line"></i> 复盘分析
          </button>
          <button class="action-btn" @click.stop="retryInterview(record)">
            <i class="fas fa-redo"></i> 再次面试
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
import { interviewRecords } from '@/shared/data.js'

const router = useRouter()

// 筛选
const typeFilter = ref('all')

// 分页
const currentPage = ref(1)
const pageSize = 5

// 过滤后的记录
const filteredRecords = computed(() => {
  let result = interviewRecords.value
  if (typeFilter.value !== 'all') {
    result = result.filter(r => r.type === typeFilter.value)
  }
  return result
})

// 分页后的记录
const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredRecords.value.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredRecords.value.length / pageSize)
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

// 统计数据
const averageScore = computed(() => {
  if (interviewRecords.value.length === 0) return '0.0'
  const sum = interviewRecords.value.reduce((acc, cur) => acc + cur.score, 0)
  return (sum / interviewRecords.value.length).toFixed(1)
})

const bestScore = computed(() => {
  if (interviewRecords.value.length === 0) return '0.0'
  return Math.max(...interviewRecords.value.map(r => r.score)).toFixed(1)
})

const totalDuration = computed(() => {
  return interviewRecords.value.reduce((acc, cur) => acc + cur.duration, 0)
})

// 切换页码
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// 跳转到详情
const goToDetail = (id) => {
  router.push(`/profile/interviews/${id}`)
}

// 再次面试
const retryInterview = (record) => {
  // 跳转到模拟面试页面，带上主题参数
  router.push(`/interview?topic=${encodeURIComponent(record.topic)}`)
}
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.profile-interviews {
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

  .stats-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;

    .stat-card {
      background: $bg-gray;
      border-radius: 8px;
      padding: 16px;
      text-align: center;

      .stat-value {
        color: $primary;
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .stat-label {
        color: $text-secondary;
        font-size: 12px;
      }
    }
  }

  .filter-bar {
    margin-bottom: 24px;

    .filter-select {
      padding: 8px 12px;
      border: 1px solid $border-color;
      border-radius: 6px;
      font-size: 14px;
      color: $text-regular;

      &:focus {
        outline: none;
        border-color: $primary;
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

  .interviews-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .interview-card {
    border: 1px solid $border-light;
    border-radius: 12px;
    padding: 20px;
    transition: all 0.3s;
    cursor: pointer;

    &:hover {
      border-color: $primary;
      transform: translateY(-2px);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .interview-type {
        font-size: 13px;
        font-weight: 500;
        padding: 4px 8px;
        border-radius: 4px;

        &.video {
          background: rgba($primary, 0.1);
          color: $primary;
        }

        &.text {
          background: rgba($success, 0.1);
          color: $success;
        }
      }

      .interview-date {
        color: $text-secondary;
        font-size: 13px;
      }
    }

    .interview-topic {
      color: $text-primary;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .interview-tags {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;

      .tag {
        font-size: 12px;
        padding: 2px 8px;
        background: $bg-gray;
        color: $text-secondary;
        border-radius: 4px;
      }
    }

    .interview-stats {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .rating {
        display: flex;
        align-items: center;
        gap: 4px;

        .star {
          color: $border-color;
          font-size: 16px;

          &.filled {
            color: #ffc107;
          }
        }

        .score {
          color: $text-regular;
          font-size: 13px;
          margin-left: 4px;
        }
      }

      .stats {
        color: $text-secondary;
        font-size: 13px;

        span {
          margin: 0 4px;
        }
      }
    }

    .card-footer {
      display: flex;
      gap: 12px;
      border-top: 1px solid $border-light;
      padding-top: 16px;

      .action-btn {
        flex: 1;
        padding: 8px;
        background: transparent;
        border: 1px solid $border-color;
        border-radius: 6px;
        color: $text-regular;
        font-size: 13px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;

        i {
          font-size: 14px;
        }

        &:hover {
          border-color: $primary;
          color: $primary;
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