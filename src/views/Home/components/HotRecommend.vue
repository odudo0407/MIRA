<template>
  <section class="hot-recommend">
    <div class="container">
      <!-- 标题 -->
      <h2 class="section-title">热点推荐</h2>
      
      <!-- 左右分栏容器 -->
      <div class="hot-grid">
        <!-- 左侧：社区热门 -->
        <div class="hot-card">
          <div class="card-header">
            <!-- 原来的图标被注释掉了，换成图片 -->
            <!-- <i class="fas fa-users"></i> -->
            <img src="@/assets/images/home-community.png" alt="社区热门" class="header-icon">
            <h3>社区热门</h3>
          </div>
          <ul class="hot-list">
            <li v-for="item in communityHot" :key="item.id" class="hot-item">
              <router-link :to="`/community/post/${item.id}`" target="_blank" class="hot-link">
                <span class="hot-title">{{ item.title }}</span>
                <span class="hot-meta">{{ item.views }}浏览 · {{ item.replies }}回复</span>
              </router-link>
            </li>
            <li class="more-item">
              <router-link to="/community" class="more-link">
                查看更多 <img src="@/assets/images/arrow-right.png" alt="箭头" class="arrow-icon">
              </router-link>
            </li>
          </ul>
        </div>
        
        <!-- 右侧：题库热门 -->
        <div class="hot-card">
          <div class="card-header">
            <!-- 原来的图标被注释掉了，换成图片 -->
            <!-- <i class="fas fa-book-open"></i> -->
            <img src="@/assets/images/home-knowledge.png" alt="题库热门" class="header-icon">
            <h3>题库热门</h3>
          </div>
          <ul class="hot-list">
            <li v-for="item in knowledgeHot" :key="item.id" class="hot-item">
              <router-link :to="`/knowledge/article/${item.id}`" target="_blank" " class="hot-link">
                <span class="hot-title">{{ item.title }}</span>
                <span class="hot-meta">{{ item.views }}浏览 · {{ item.likes }}点赞</span>
              </router-link>
            </li>
            <li class="more-item">
              <router-link to="/knowledge" class="more-link">
                查看更多 <img src="@/assets/images/arrow-right.png" alt="箭头" class="arrow-icon">
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// 社区热门数据
const communityHot = ref([
  { id: 1, title: '字节跳动一面面经（已拿offer）', views: 2341, replies: 45 },
  { id: 2, title: '腾讯WXG前端面经', views: 1876, replies: 32 },
  { id: 3, title: '阿里巴巴实习面经', views: 1543, replies: 28 },
  { id: 4, title: '美团到店事业群面经', views: 1234, replies: 19 },
  { id: 5, title: '2024前端面试题汇总', views: 3421, replies: 67 }
])

// 题库热门数据
const knowledgeHot = ref([
  { id: 1, title: '2024前端学习路线图', views: 5678, likes: 234 },
  { id: 2, title: 'Node.js后端开发指南', views: 4321, likes: 187 },
  { id: 3, title: 'LeetCode刷题攻略', views: 3987, likes: 156 },
  { id: 4, title: '前端八股文合集', views: 6543, likes: 278 },
  { id: 5, title: 'Vue3源码解析', views: 2890, likes: 145 }
])
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.hot-recommend {
  padding: 60px 0;
  background: $white;
}

.container {
  width: $container-width;
  margin: 0 auto;
  max-width: 1000px;  // 限制整体宽度，让两边模块变窄
}

.section-title {
  text-align: center;
  font-size: 32px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 40px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: $primary;
    border-radius: 2px;
  }
}

.hot-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.hot-card {
  background: $bg-gray;
  border-radius: 16px;
  padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid $border-light;
  
  /* 添加图片样式 */
  .header-icon {
    width: 24px;      // 与原来的图标字体大小保持一致
    height: 24px;
    object-fit: contain;
  }
  
  h3 {
    font-size: 20px;
    font-weight: 600;
    color: $text-primary;
  }
}

.hot-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.hot-item {
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.hot-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  padding: 8px;
  border-radius: 6px;
  
  .hot-title {
    color: $text-regular;
    font-size: 14px;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 15px;
    transition: all 0.2s;
  }
  
  .hot-meta {
    color: $text-secondary;
    font-size: 12px;
    white-space: nowrap;
    transition: all 0.2s;
  }
  
  &:hover {
    .hot-title {
      color: $text-primary;
      font-weight: 600;
    }
    
    .hot-meta {
      color: $text-regular;
    }
  }
}

.more-item {
  margin-top: 16px;
  text-align: right;
}

.more-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: $primary;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 20px;
  background: rgba($primary, 0.1);
}

.arrow-icon {
  width: 14px;
  height: 14px;
  object-fit: contain;
}

// 手机适配
@media (max-width: 768px) {
  .hot-recommend {
    padding: 40px 0;
  }
  
  .section-title {
    font-size: 24px;
    margin-bottom: 30px;
  }
  
  .hot-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .hot-card {
    padding: 16px;
  }
  
  .card-header {
    .header-icon {
      width: 20px;    // 移动端稍微小一点
      height: 20px;
    }
  }
  
  .hot-link {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .hot-meta {
    margin-left: 0;
  }

  .arrow-icon {
    width: 12px;
    height: 12px;
  }
}
</style>