<template>
  <div class="post-detail">
    <NavBar />
    
    <div class="container">
      <div class="post-main" v-if="post">
        <!-- 头部：左右布局 - 标题在左，关注按钮+名称+头像在右 -->
        <div class="post-header">
          <!-- 左侧：标题区域 -->
          <div class="title-section">
            <h1 class="post-title">{{ post.title }}</h1>
            <div class="post-meta">
              <span class="time">{{ formatTime(post.time) }}</span>
              <span class="views">· {{ post.views }} 浏览</span>
            </div>
          </div>
          
          <!-- 右侧：关注按钮 + 名称 + 头像（从左到右） -->
          <div class="author-section">
            <!-- 如果是自己的帖子，显示“我的帖子”标签 -->
            <span v-if="isMyPost" class="my-post-badge">
              <i class="fas fa-check-circle"></i> 我的帖子
            </span>
            
            <!-- 如果不是自己的帖子才显示关注按钮 -->
            <button 
              v-else
              class="follow-btn" 
              :class="{ following: isFollowing }"
              @click="handleFollow"
            >
              <img 
                :src="isFollowing ? followIcon : heartIcon" 
                :alt="isFollowing ? '已关注' : '关注'"
                class="btn-icon"
              >
              {{ isFollowing ? '已关注' : '关注' }}
            </button>
            
            <!-- 作者名称 -->
            <span class="author-name">{{ post.author }}</span>
            
            <!-- 作者头像 -->
            <img :src="post.avatar" alt="" class="author-avatar">
          </div>
        </div>
        
        <!-- 帖子正文 -->
        <div class="post-body">
          {{ post.content }}
        </div>

        <!-- 操作按钮区域 - 点赞和收藏放在一起 -->
        <div class="action-section">
          <!-- 点赞按钮 -->
          <button class="action-btn like-btn" @click="handleLike" :class="{ liked: hasLiked }">
            <img 
              :src="hasLiked ? likeFilledIcon : likeIcon" 
              alt="点赞" 
              class="btn-icon"
            >
            {{ post.likes }}
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
      </div>
      
      <div class="replies-section">
        <h3>全部回复 ({{ post?.replies?.length || 0 }})</h3>
        
        <div class="replies-list">
          <div v-for="reply in post?.replies" :key="reply.id" class="reply-item">
            <div class="reply-avatar">
              <img :src="reply.avatar" alt="">
            </div>
            <div class="reply-content">
              <div class="reply-header">
                <span class="reply-author">{{ reply.author }}</span>
                <span class="reply-time">{{ formatTime(reply.time) }}</span>
              </div>
              <p class="reply-text">{{ reply.content }}</p>
            </div>
          </div>
        </div>
        
        <!-- 评论框容器 - 左边输入框，右边按钮（只有输入框增高） -->
        <div class="reply-container">
          <!-- 左侧：评论输入框（自动增高） -->
          <div class="reply-input-wrapper" :style="{ height: textareaHeight + 'px' }">
            <textarea 
              v-model="newReply" 
              placeholder="写下你的回复..."
              class="reply-textarea"
              ref="textareaRef"
              @input="autoResize"
            ></textarea>
          </div>
          
          <!-- 右侧：发表回复按钮（固定高度，不跟随） -->
          <div class="reply-button-wrapper">
            <button class="reply-submit-btn" @click="submitReply" :disabled="!canReply">
              发表回复
            </button>
          </div>
        </div>
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
const heartIcon = '/src/assets/images/user-heart.png'
const followIcon = '/src/assets/images/follow.png'
const likeIcon = '/src/assets/images/like-article.png'
const likeFilledIcon = '/src/assets/images/like-article2.png'
const starIcon = '/src/assets/images/star.png'
const starFilledIcon = '/src/assets/images/star-w.png'

const route = useRoute()
const router = useRouter()
const post = ref(null)
const newReply = ref('')

// 自动增高相关
const textareaRef = ref(null)
const textareaHeight = ref(42)

// 登录状态 - 从 localStorage 获取
const isLogin = computed(() => {
  return !!localStorage.getItem('user')
})

// 当前用户信息
const currentUserInfo = computed(() => currentUser.value)

// 判断是否是自己的帖子
const isMyPost = computed(() => {
  return currentUserInfo.value?.name === post.value?.author
})

// 关注状态
const isFollowing = ref(false)

// 点赞状态
const hasLiked = ref(false)

// 收藏状态
const isFavorited = ref(false)

// 模拟帖子数据
const mockPost = {
  id: 2,
  title: '字节跳动前端一面面经（已拿offer）',
  author: '前端小王子',
  time: Date.now() - 3600000,
  content: '刚面完字节前端岗，热乎的面经！一面主要问了：\n\n1. Vue3响应式原理\n2. 闭包应用\n3. 算法题：两数之和\n4. 项目经验\n\n面试官很nice，全程引导...',
  views: 1234,
  likes: 89,
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  replies: [
    {
      id: 1,
      author: '路人甲',
      content: '谢谢分享！',
      time: Date.now() - 1800000,
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    {
      id: 2,
      author: '面试新手',
      content: '想问下面试官态度怎么样？',
      time: Date.now() - 1200000,
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
    }
  ]
}

onMounted(() => {
  post.value = mockPost
  
  // 检查是否已收藏
  if (currentUserInfo.value) {
    isFavorited.value = isFavorite(currentUserInfo.value.id, 'post', post.value.id)
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

// 检查登录
const checkLogin = () => {
  if (!isLogin.value) {
    router.push('/login')
    return false
  }
  return true
}

// 处理关注按钮点击
const handleFollow = () => {
  if (!checkLogin()) return
  
  isFollowing.value = !isFollowing.value
  console.log(isFollowing.value ? '已关注' : '取消关注')
}

// 处理点赞
const handleLike = () => {
  if (!checkLogin()) return
  
  if (!hasLiked.value) {
    hasLiked.value = true
    post.value.likes++
  }
}

// 处理收藏（需要登录）
const handleFavorite = () => {
  if (!checkLogin()) return
  
  if (!currentUserInfo.value) return
  
  if (isFavorited.value) {
    // 取消收藏
    removeFavorite(currentUserInfo.value.id, 'post', post.value.id)
    isFavorited.value = false
  } else {
    // 添加收藏
    addFavorite(currentUserInfo.value.id, 'post', {
      id: post.value.id,
      title: post.value.title,
      author: post.value.author
    })
    isFavorited.value = true
  }
}

// 修改这里：只检查是否有内容，不检查登录状态
const canReply = computed(() => {
  return newReply.value.trim()
})

const submitReply = () => {
  // 未登录时跳转登录页
  if (!checkLogin()) return
  if (!canReply.value) return
  
  const newReplyObj = {
    id: post.value.replies.length + 1,
    author: currentUserInfo.value?.name || '当前用户',
    content: newReply.value,
    time: Date.now(),
    avatar: currentUserInfo.value?.avatar || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`
  }
  
  post.value.replies.push(newReplyObj)
  newReply.value = ''
  
  // 提交后重置高度
  setTimeout(() => {
    textareaHeight.value = 42
  }, 0)
}

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

.post-detail {
  background: $bg-body;
  min-height: 100vh;
}

.container {
  width: $container-width;
  margin: 30px auto;
}

.post-main {
  background: $white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  border: 1px solid $border-light;
}

/* 头部左右布局 */
.post-header {
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
  
  .post-title {
    font-size: 28px;
    font-weight: 700;
    color: $text-primary;
    margin-bottom: 10px;
    line-height: 1.3;
  }
  
  .post-meta {
    color: $text-secondary;
    font-size: 14px;
    
    .views {
      margin-left: 5px;
    }
  }
}

/* 右侧作者区域 - 从左到右：标签/关注按钮、名称、头像 */
.author-section {
  display: flex;
  align-items: center;
  gap: 15px;
  min-width: auto;
  
  .author-name {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
    white-space: nowrap;
  }
  
  .author-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }
}

/* 我的帖子标签 */
.my-post-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background: rgba($primary, 0.1);
  color: $primary;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  
  i {
    font-size: 12px;
  }
}

/* 关注按钮 */
.follow-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 16px;
  border: 3px solid $primary;
  border-radius: 30px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  color: $primary;
  min-width: 80px;
  height: 40px;
  
  /* 已关注样式 */
  &.following {
    background: $primary;
    border-color: $primary;
    color: white;
    
    .btn-icon {
      filter: brightness(0) invert(1);
    }
  }
  
  .btn-icon {
    width: 16px;
    height: 16px;
    object-fit: contain;
  }
}

.post-body {
  color: $text-regular;
  line-height: 1.8;
  white-space: pre-line;
  font-size: 16px;
  margin-bottom: 0;
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

.replies-section {
  background: $white;
  border-radius: 12px;
  padding: 30px;
  border: 1px solid $border-light;
  
  h3 {
    color: $text-primary;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid $border-light;
    font-size: 18px;
    font-weight: 600;
  }
}

.reply-item {
  display: flex;
  gap: 15px;
  padding: 20px 0;
  border-bottom: 1px solid $border-light;
  
  &:last-child {
    border-bottom: none;
  }
}

.reply-avatar {
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

.reply-content {
  flex: 1;
}

.reply-header {
  display: flex;
  gap: 15px;
  margin-bottom: 5px;
  
  .reply-author {
    font-weight: 600;
    color: $text-primary;
    font-size: 14px;
  }
  
  .reply-time {
    color: $text-secondary;
    font-size: 12px;
  }
}

.reply-text {
  color: $text-regular;
  line-height: 1.6;
  font-size: 14px;
}

/* 评论容器 - 左右布局 */
.reply-container {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid $border-light;
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
  
  /* 隐藏滚动条 */
  overflow-y: hidden;
  
  &:focus {
    outline: none;
  }
}

/* 右侧：按钮容器 - 固定高度，不跟随 */
.reply-button-wrapper {
  width: 90px;
  height: 42px;
  flex-shrink: 0;
}

/* 发表回复按钮 */
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

// 手机适配
@media (max-width: 768px) {
  .container {
    width: 100%;
    padding: 0 20px;
  }
  
  .post-header {
    flex-direction: column;
    gap: 20px;
  }
  
  .author-section {
    justify-content: flex-end;
    width: 100%;
  }
  
  .post-main,
  .replies-section {
    padding: 20px;
  }
  
  .post-title {
    font-size: 22px;
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