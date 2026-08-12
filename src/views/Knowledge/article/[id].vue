<template>
  <div class="article-detail">
    <NavBar />
    
    <div class="container">
      <div class="article-content" v-if="article">
        <!-- 头部：左右布局 - 标题在左，作者信息在右 -->
        <div class="article-header">
          <!-- 左侧：标题区域 -->
          <div class="title-section">
            <h1 class="title">{{ article.title }}</h1>
            
            <!-- 标签 -->
            <div class="tags">
              <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
          
          <!-- 右侧：作者信息（与左侧标签对齐） -->
          <div class="author-section">
            <div class="author-info">
              <span class="author">{{ article.author }}</span>
              <span class="date">{{ article.date }}</span>
            </div>
          </div>
        </div>

        <!-- 文章内容 -->
        <div class="content" v-html="article.content"></div>

        <!-- 操作按钮区域 - 点赞和收藏放在一起 -->
        <div class="action-section">
          <!-- 点赞按钮 -->
          <button class="action-btn like-btn" @click="handleLike" :class="{ liked: hasLiked }">
            <img 
              :src="hasLiked ? likeFilledIcon : likeIcon" 
              alt="点赞" 
              class="btn-icon"
            >
            {{ article.likes }}
          </button>

          <!-- 收藏按钮 -->
          <button class="action-btn favorite-btn" @click="handleFavorite" :class="{ favorited: isFavorited }">
            <img 
              :src="isFavorited ? starFilledIcon : starIcon" 
              alt="收藏" 
              class="btn-icon"
            >
            {{ isFavorited ? '已收藏' : '收藏' }}
          </button>
        </div>

        <!-- 评论区 -->
        <div class="comments-section">
          <h3>全部回复 ({{ article.comments || comments.length }})</h3>
          
          <div class="comments-list">
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <div class="comment-avatar">
                <img :src="comment.avatar" alt="">
              </div>
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-author">{{ comment.author }}</span>
                  <span class="comment-time">{{ comment.time }}</span>
                </div>
                <p class="comment-text">{{ comment.content }}</p>
              </div>
            </div>
          </div>

          <!-- 评论框容器 - 左边输入框，右边按钮（自动增高） -->
          <div class="reply-container">
            <!-- 左侧：评论输入框（自动增高） -->
            <div class="reply-input-wrapper" :style="{ height: textareaHeight + 'px' }">
              <textarea 
                v-model="newComment" 
                placeholder="写下你的评论..."
                class="reply-textarea"
                ref="textareaRef"
                @input="autoResize"
              ></textarea>
            </div>
            
            <!-- 右侧：发表评论按钮（固定高度） -->
            <div class="reply-button-wrapper">
              <button class="reply-submit-btn" @click="submitComment" :disabled="!canSubmit">
                发表评论
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="loading">
        加载中...
      </div>
    </div>

    <FooterSection />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '@/views/Home/components/NavBar.vue'
import FooterSection from '@/views/Home/components/FooterSection.vue'
import { currentUser, isFavorite, addFavorite, removeFavorite } from '@/shared/data.js'

// 图标路径
const likeIcon = '/src/assets/images/like-article.png'
const likeFilledIcon = '/src/assets/images/like-article2.png'
const starIcon = '/src/assets/images/star.png'
const starFilledIcon = '/src/assets/images/star-w.png'

const route = useRoute()
const router = useRouter()
const article = ref(null)
const newComment = ref('')
const comments = ref([])

// 自动增高相关
const textareaRef = ref(null)
const textareaHeight = ref(42)

// 登录状态 - 从 localStorage 获取
const isLogin = computed(() => {
  return !!localStorage.getItem('user')
})

// 当前用户信息
const currentUserInfo = computed(() => currentUser.value)

// 点赞状态
const hasLiked = ref(false)

// 收藏状态
const isFavorited = ref(false)

// 检查登录（通用方法）
const checkLogin = () => {
  if (!isLogin.value) {
    router.push('/login')
    return false
  }
  return true
}

// 模拟文章数据
const mockArticle = {
  id: 1,
  title: '字节跳动前端一面面经（已拿offer）',
  author: '前端小王子',
  date: '2024-03-15',
  readTime: '8分钟',
  views: 1234,
  likes: 89,
  comments: 2,
  tags: ['面经', '字节', '一面'],
  content: `
    <h2>一面面经</h2>
    <p>刚面完字节前端岗，热乎的面经！</p>
    
    <h3>1. Vue3响应式原理</h3>
    <p>面试官问：Vue3的响应式是怎么实现的？和Vue2有什么区别？</p>
    <p>答：Vue3使用Proxy代理对象，Vue2使用Object.defineProperty。Proxy可以监听整个对象的变化，包括属性的添加和删除，而defineProperty只能监听已有属性。同时Proxy的性能也更好。</p>
    
    <h3>2. 闭包的应用</h3>
    <p>面试官问：实际项目中闭包有哪些应用场景？</p>
    <p>答：防抖节流函数、循环绑定事件、模块化开发、函数柯里化等。</p>
    
    <h3>3. 算法题：两数之和</h3>
    <p>给定一个数组和目标值，返回两个数下标，使它们的和等于目标值。</p>
  `
}

// 模拟评论数据
const mockComments = [
  {
    id: 1,
    author: '面试新手',
    time: '2小时前',
    content: '谢谢分享！很有帮助',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
  {
    id: 2,
    author: '代码猎人',
    time: '5小时前',
    content: '算法题还有其他解法吗？',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
  }
]

onMounted(() => {
  article.value = mockArticle
  comments.value = mockComments
  
  // 检查是否已收藏
  if (currentUserInfo.value) {
    isFavorited.value = isFavorite(currentUserInfo.value.id, 'article', article.value.id)
  }
})

// 自动调整高度的函数
const autoResize = () => {
  const textarea = textareaRef.value
  if (textarea) {
    textarea.style.height = 'auto'
    const newHeight = Math.max(42, textarea.scrollHeight)
    textareaHeight.value = newHeight
  }
}

// 处理点赞（需要登录）
const handleLike = () => {
  if (!checkLogin()) return
  
  if (!hasLiked.value) {
    hasLiked.value = true
    article.value.likes++
  }
}

// 处理收藏（需要登录）
const handleFavorite = () => {
  if (!checkLogin()) return
  
  if (!currentUserInfo.value) return
  
  if (isFavorited.value) {
    // 取消收藏
    removeFavorite(currentUserInfo.value.id, 'article', article.value.id)
    isFavorited.value = false
  } else {
    // 添加收藏
    addFavorite(currentUserInfo.value.id, 'article', {
      id: article.value.id,
      title: article.value.title,
      author: article.value.author
    })
    isFavorited.value = true
  }
}

// 修改这里：只检查是否有内容，不检查登录状态
const canSubmit = computed(() => {
  return newComment.value.trim()
})

// 提交评论（需要登录）
const submitComment = () => {
  // 未登录时跳转登录页
  if (!checkLogin()) return
  if (!canSubmit.value) return
  
  const newCommentObj = {
    id: Date.now(),
    author: currentUserInfo.value?.name || '当前用户',
    time: '刚刚',
    content: newComment.value,
    avatar: currentUserInfo.value?.avatar || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`
  }
  
  comments.value.push(newCommentObj)
  article.value.comments++
  newComment.value = ''
  
  // 重置评论框高度
  setTimeout(() => {
    textareaHeight.value = 42
  }, 0)
}
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.article-detail {
  background: $bg-body;
  min-height: 100vh;
}

.container {
  width: $container-width;
  margin: 0 auto;
  padding: 30px 0;
}

.article-content {
  background: $white;
  border-radius: 12px;
  padding: 40px;
  border: 1px solid $border-light;
}

/* 头部左右布局 */
.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid $border-light;
}

/* 左侧标题区域 */
.title-section {
  flex: 1;

  .title {
    font-size: 28px;
    font-weight: 700;
    color: $text-primary;
    margin: 0 0 12px 0;
    line-height: 1.3;
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

/* 右侧作者区域 - 与左侧标签对齐 */
.author-section {
  min-width: 180px;
  text-align: right;
  margin-top: 38px;

  .author-info {
    .author {
      color: $primary;
      font-weight: 500;
      font-size: 14px;
      margin-right: 12px;
    }

    .date {
      color: $text-secondary;
      font-size: 12px;
    }
  }
}

/* 文章内容 */
.content {
  color: $text-regular;
  line-height: 1.8;
  font-size: 16px;

  h2 {
    font-size: 22px;
    color: $text-primary;
    margin: 30px 0 15px;
  }

  h3 {
    font-size: 18px;
    color: $text-primary;
    margin: 25px 0 10px;
  }

  p {
    margin-bottom: 15px;
  }
}

/* 操作按钮区域 - 点赞和收藏放在一起 */
.action-section {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 40px 0 20px;

  .action-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 24px;
    border: 2px solid $primary;
    border-radius: 30px;
    background: transparent;
    color: $primary;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;

    &.liked {
      background: $primary;
      color: white;

      .btn-icon {
        filter: brightness(0) invert(1);
      }
    }

    &.favorited {
      background: $primary;
      border-color: $primary;
      color: white;

      .btn-icon {
        filter: brightness(0) invert(1);
      }
    }

    .btn-icon {
      width: 20px;
      height: 20px;
      object-fit: contain;
    }

    &:hover:not(.liked):not(.favorited) {
      background: rgba($primary, 0.1);
    }
  }
}

/* 评论区 */
.comments-section {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid $border-light;

  h3 {
    color: $text-primary;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
  }
}

.comments-list {
  margin-bottom: 30px;
}

.comment-item {
  display: flex;
  gap: 15px;
  padding: 20px 0;
  border-bottom: 1px solid $border-light;

  &:last-child {
    border-bottom: none;
  }
}

.comment-avatar {
  width: 40px;
  height: 40px;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  gap: 15px;
  margin-bottom: 5px;

  .comment-author {
    font-weight: 600;
    color: $text-primary;
    font-size: 14px;
  }

  .comment-time {
    color: $text-secondary;
    font-size: 12px;
  }
}

.comment-text {
  color: $text-regular;
  line-height: 1.6;
  font-size: 14px;
}

/* 评论容器 - 与社区一致 */
.reply-container {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  align-items: flex-start;
}

/* 左侧：评论输入框容器 - 自动高度 */
.reply-input-wrapper {
  flex: 1;
  min-height: 42px;
  border: 1px solid $border-color;
  border-radius: 8px;
  overflow: hidden;
  transition: height 0.1s ease;
}

/* 评论输入框 */
.reply-textarea {
  width: 100%;
  height: 100%;
  padding: 10px 12px;
  border: none;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  overflow-y: hidden;

  &:focus {
    outline: none;
  }
}

/* 右侧：按钮容器 - 固定高度 */
.reply-button-wrapper {
  width: 90px;
  height: 42px;
  flex-shrink: 0;
}

/* 发表评论按钮 */
.reply-submit-btn {
  width: 100%;
  height: 100%;
  background: $primary;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: $primary-dark;
  }

  &:disabled {
    background: $text-placeholder;
    cursor: not-allowed;
  }
}

.loading {
  text-align: center;
  padding: 100px 0;
  color: $text-secondary;
}

// 手机适配
@media (max-width: 768px) {
  .container {
    width: 100%;
    padding: 0 20px;
  }

  .article-header {
    flex-direction: column;
    gap: 20px;
  }

  .author-section {
    text-align: left;
    width: 100%;
    margin-top: 0;
  }

  .action-section {
    flex-direction: column;
    gap: 10px;
    
    .action-btn {
      width: 100%;
      justify-content: center;
    }
  }

  .reply-container {
    flex-direction: column;
    gap: 10px;
  }

  .reply-button-wrapper {
    width: 100%;
    height: 42px;
  }
}
</style>