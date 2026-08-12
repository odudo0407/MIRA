<!-- src/views/Knowledge/components/ArticleCard.vue -->
<template>
  <div class="article-card" @click="openInNewTab">
    <!-- 左侧：标题区域 -->
    <div class="card-left">
      <h2 class="title">{{ article.title }}</h2>
      
      <!-- 标签 -->
      <div class="tags">
        <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>
    
    <!-- 右侧：作者时间 + 统计信息 -->
    <div class="card-right">
      <!-- 作者和时间（与左侧标题底部对齐） -->
      <div class="meta-row">
        <span class="author">{{ article.author }}</span>
        <span class="time">&nbsp;&nbsp;{{ article.date }}</span>
      </div>
      
      <!-- 统计信息（与左侧标签顶部对齐） -->
      <div class="stats">
        <span>
          <img src="@/assets/images/eye.png" alt="浏览" class="stat-icon">
          {{ article.views }}
        </span>
        <span>
          <img src="@/assets/images/message.png" alt="回复" class="stat-icon">
          {{ article.comments }}
        </span>
        <span>
          <img src="@/assets/images/like.png" alt="点赞" class="stat-icon">
          {{ article.likes }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps(['article'])
const router = useRouter()

const openInNewTab = () => {
  const url = router.resolve(`/knowledge/article/${props.article.id}`).href
  window.open(url, '_blank')
}
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.article-card {
  display: flex;
  justify-content: space-between;
  background: $white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid $border-light;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    border-color: $primary;
    transform: translateY(-2px);
  }

  /* 左侧 */
  .card-left {
    flex: 1;
    display: flex;
    flex-direction: column;

    .title {
      font-size: 18px;
      font-weight: 600;
      color: $text-primary;
      line-height: 1.4;
      margin: 0 0 12px 0;  /* 固定底部间距 */
    }

    .tags {
      display: flex;
      gap: 8px;

      .tag {
        font-size: 12px;
        padding: 2px 8px;
        background: $bg-gray;
        color: $text-secondary;
        border-radius: 4px;
      }
    }
  }

  /* 右侧 */
  .card-right {
    min-width: 180px;
    text-align: right;
    display: flex;
    flex-direction: column;

    /* 作者和时间 */
    .meta-row {
      margin: 0 0 12px 0;  /* 与左侧标题的底部间距保持一致 */
      
      .author {
        color: $primary;
        font-weight: 500;
        font-size: 14px;
      }

      .time {
        color: $text-secondary;
        font-size: 12px;
        margin-left: 4px;
      }
    }

    /* 统计信息 */
    .stats {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      color: $text-secondary;
      font-size: 13px;

      .stat-icon {
        width: 16px;
        height: 16px;
        margin-right: 4px;
        vertical-align: middle;
        object-fit: contain;
      }
    }
  }
}

// 手机适配
@media (max-width: 768px) {
  .article-card {
    flex-direction: column;
    gap: 15px;

    .card-right {
      min-width: auto;
      text-align: left;

      .meta-row {
        margin-bottom: 8px;
      }

      .stats {
        justify-content: flex-start;
      }
    }
  }
}
</style>