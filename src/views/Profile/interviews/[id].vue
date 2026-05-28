<template>
  <div class="interview-detail">
    <div class="detail-header">
      <button class="back-btn" @click="router.back()">
        <i class="fas fa-arrow-left"></i> 返回
      </button>
    </div>

    <div v-if="record" class="detail-content">
      <div class="title-section">
        <h1>{{ record.topic }}</h1>
        <div class="meta">
          <span class="type" :class="record.type">
            {{ record.type === 'video' ? '视频面试' : '文字面试' }}
          </span>
          <span class="date">{{ record.date }} {{ record.time }}</span>
        </div>
      </div>

      <!-- 评分卡片 -->
      <div class="score-card">
        <div class="overall-score">
          <div class="score-value">{{ record.score }}</div>
          <div class="score-label">综合评分</div>
          <div class="stars">
            <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= Math.floor(record.score) }">
              ★
            </span>
          </div>
        </div>
        <div class="score-details">
          <div class="detail-item">
            <span class="label">时长</span>
            <span class="value">{{ record.duration }}分钟</span>
          </div>
          <div class="detail-item">
            <span class="label">对话轮次</span>
            <span class="value">{{ record.rounds }}轮</span>
          </div>
        </div>
      </div>

      <!-- 分析卡片 -->
      <div class="analysis-card">
        <h3>AI复盘分析</h3>
        
        <div class="strengths">
          <h4>优势</h4>
          <ul>
            <li v-for="(item, index) in record.strengths" :key="index">{{ item }}</li>
          </ul>
        </div>

        <div class="weaknesses">
          <h4>待改进</h4>
          <ul>
            <li v-for="(item, index) in record.weaknesses" :key="index">{{ item }}</li>
          </ul>
        </div>
      </div>

      <!-- 对话回顾 -->
      <div class="conversation-card">
        <h3>对话回顾</h3>
        
        <div v-for="(item, index) in record.conversation" :key="index" class="conversation-item">
          <div class="question">
            <span class="q-label">Q{{ index + 1 }}:</span>
            {{ item.question }}
          </div>
          <div class="answer">
            <span class="a-label">A:</span>
            {{ item.answer }}
          </div>
          <div class="evaluation" :class="{ good: item.score >= 4 }">
            <span class="e-label">AI评价:</span>
            {{ item.evaluation }}
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button class="action-btn primary" @click="retryInterview">
          <i class="fas fa-redo"></i> 再次面试
        </button>
        <button class="action-btn" @click="shareInterview">
          <i class="fas fa-share-alt"></i> 分享面经
        </button>
      </div>
    </div>

    <div v-else class="loading">
      加载中...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getInterviewRecord } from '@/shared/data.js'

const route = useRoute()
const router = useRouter()
const record = ref(null)

onMounted(() => {
  const id = parseInt(route.params.id)
  record.value = getInterviewRecord(id)
})

// 再次面试
const retryInterview = () => {
  router.push(`/interview?topic=${encodeURIComponent(record.value.topic)}`)
}

// 分享面经
const shareInterview = () => {
  // 跳转到社区发布页面，自动填充内容
  router.push({
    path: '/community',
    query: {
      share: 'interview',
      topic: record.value.topic,
      content: record.value.conversation.map(c => `Q: ${c.question}\nA: ${c.answer}`).join('\n\n')
    }
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.interview-detail {
  .detail-header {
    margin-bottom: 24px;

    .back-btn {
      background: transparent;
      border: none;
      color: $text-regular;
      font-size: 14px;
      cursor: pointer;
      padding: 8px 0;

      &:hover {
        color: $primary;
      }

      i {
        margin-right: 4px;
      }
    }
  }

  .detail-content {
    .title-section {
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid $border-light;

      h1 {
        color: $text-primary;
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 8px;
      }

      .meta {
        display: flex;
        gap: 16px;
        align-items: center;

        .type {
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

        .date {
          color: $text-secondary;
          font-size: 13px;
        }
      }
    }

    .score-card {
      background: $bg-gray;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .overall-score {
        text-align: center;

        .score-value {
          color: $primary;
          font-size: 48px;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 4px;
        }

        .score-label {
          color: $text-secondary;
          font-size: 12px;
          margin-bottom: 8px;
        }

        .stars {
          display: flex;
          gap: 4px;

          .star {
            color: $border-color;
            font-size: 20px;

            &.filled {
              color: #ffc107;
            }
          }
        }
      }

      .score-details {
        display: flex;
        gap: 32px;

        .detail-item {
          text-align: center;

          .label {
            display: block;
            color: $text-secondary;
            font-size: 12px;
            margin-bottom: 4px;
          }

          .value {
            color: $text-primary;
            font-size: 20px;
            font-weight: 600;
          }
        }
      }
    }

    .analysis-card {
      background: $white;
      border: 1px solid $border-light;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;

      h3 {
        color: $text-primary;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 20px;
      }

      .strengths, .weaknesses {
        margin-bottom: 16px;

        h4 {
          font-size: 14px;
          margin-bottom: 8px;
        }

        ul {
          list-style: none;
          padding: 0;

          li {
            padding: 8px 12px;
            background: $bg-gray;
            border-radius: 6px;
            margin-bottom: 8px;
            font-size: 14px;
            color: $text-regular;
          }
        }
      }

      .strengths h4 {
        color: $success;
      }

      .weaknesses h4 {
        color: $warning;
      }
    }

    .conversation-card {
      background: $white;
      border: 1px solid $border-light;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;

      h3 {
        color: $text-primary;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 20px;
      }

      .conversation-item {
        margin-bottom: 24px;
        padding-bottom: 24px;
        border-bottom: 1px solid $border-light;

        &:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .question, .answer, .evaluation {
          margin-bottom: 12px;
          font-size: 14px;
          line-height: 1.6;
        }

        .q-label, .a-label, .e-label {
          font-weight: 600;
          margin-right: 8px;
        }

        .q-label {
          color: $primary;
        }

        .a-label {
          color: $success;
        }

        .e-label {
          color: $text-secondary;
        }

        .evaluation {
          padding: 12px;
          background: $bg-gray;
          border-radius: 8px;

          &.good {
            background: rgba($success, 0.1);
          }
        }
      }
    }

    .action-buttons {
      display: flex;
      gap: 12px;

      .action-btn {
        flex: 1;
        padding: 12px;
        border: 1px solid $border-color;
        border-radius: 8px;
        background: transparent;
        color: $text-regular;
        font-size: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        i {
          font-size: 16px;
        }

        &.primary {
          background: $primary;
          border-color: $primary;
          color: white;

          &:hover {
            background: $primary-dark;
          }
        }

        &:hover:not(.primary) {
          border-color: $primary;
          color: $primary;
        }
      }
    }
  }

  .loading {
    text-align: center;
    padding: 60px 0;
    color: $text-secondary;
  }
}
</style>