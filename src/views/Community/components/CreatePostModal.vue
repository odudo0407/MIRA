<!-- src/views/Community/components/CreatePostModal.vue -->
<template>
  <Transition name="slide-up">
    <div v-if="visible" class="modal-overlay" @click.self="close">
      <div class="modal-container">
        <div class="modal-header">
          <h3>发布新帖子</h3>
          <button class="close-btn" @click="close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <!-- 标题输入框 -->
          <input 
            v-model="form.title" 
            placeholder="输入帖子标题..."
            class="title-input"
          >
          
          <!-- 正文输入框 - 固定高度，内部滚动 -->
          <textarea 
            v-model="form.content" 
            placeholder="分享你的面经、问题或吐槽..."
            class="content-textarea"
          ></textarea>
          
          <!-- 分类选择和发布按钮 -->
          <div class="action-row">
            <select v-model="form.category" class="category-select">
              <option value="面经分享">面经分享</option>
              <option value="技术问答">技术问答</option>
              <option value="求职吐槽">求职吐槽</option>
              <option value="资源推荐">资源推荐</option>
            </select>
            
            <button class="btn-primary" @click="submitPost" :disabled="!canPost">
              <i class="fas fa-paper-plane"></i> 发布
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- 成功提示弹窗 -->
  <Transition name="fade">
    <div v-if="showSuccess" class="success-toast">
      <div class="success-content">
        <i class="fas fa-check-circle"></i>
        <p>发布成功！</p>
        <div class="success-actions">
          <button class="action-btn stay" @click="stayInCommunity">留在社区</button>
          <button class="action-btn go" @click="goToProfile">去看看</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { currentUser } from '@/shared/data.js'

const props = defineProps({
  visible: Boolean
})
const emit = defineEmits(['update:visible', 'post-created'])
const router = useRouter()

// 成功提示
const showSuccess = ref(false)

const form = ref({
  title: '',
  content: '',
  category: '面经分享'
})

// 判断是否能发布（标题和内容不能为空）
const canPost = computed(() => {
  return form.value.title.trim() && form.value.content.trim()
})

const close = () => {
  emit('update:visible', false)
  // 清空表单
  form.value.title = ''
  form.value.content = ''
  form.value.category = '面经分享'
}

const submitPost = () => {
  if (!canPost.value) return
  
  const newPost = {
    id: Date.now(),
    title: form.value.title,
    author: currentUser.value?.name || '当前用户',
    time: Date.now(),
    summary: form.value.content.slice(0, 100) + (form.value.content.length > 100 ? '...' : ''),
    content: form.value.content,
    views: 0,
    likes: 0,
    replies: 0,
    category: form.value.category,
    avatar: currentUser.value?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'
  }
  
  emit('post-created', newPost)
  
  // 关闭弹窗
  emit('update:visible', false)
  
  // 显示成功提示
  showSuccess.value = true
  
  // 清空表单
  form.value.title = ''
  form.value.content = ''
  form.value.category = '面经分享'
}

// 留在社区
const stayInCommunity = () => {
  showSuccess.value = false
}

// 去个人中心
const goToProfile = () => {
  showSuccess.value = false
  router.push('/profile/posts')
}
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  width: 100%;
  max-width: 600px;
  border-radius: 20px 20px 0 0;
  padding: 20px;
  animation: slideIn 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    color: $text-primary;
    font-size: 18px;
    font-weight: 600;
  }
  
  .close-btn {
    background: none;
    border: none;
    color: $text-regular;
    font-size: 20px;
    cursor: pointer;
    padding: 4px;
    
    &:hover {
      color: $primary;
    }
  }
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  .title-input {
    width: 100%;
    padding: 12px;
    border: 1px solid $border-color;
    border-radius: 8px;
    font-size: 16px;
    height: 48px;
    box-sizing: border-box;
    
    &:focus {
      outline: none;
      border-color: $primary;
    }
  }
  
  .content-textarea {
    width: 100%;
    height: 200px;
    padding: 12px;
    border: 1px solid $border-color;
    border-radius: 8px;
    font-size: 14px;
    line-height: 1.6;
    resize: none;
    box-sizing: border-box;
    
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
    
    &:focus {
      outline: none;
      border-color: $primary;
    }
  }
  
  .action-row {
    display: flex;
    gap: 12px;
    align-items: center;
    
    .category-select {
      flex: 1;
      padding: 12px;
      border: 1px solid $border-color;
      border-radius: 8px;
      font-size: 14px;
      height: 48px;
      box-sizing: border-box;
      
      &:focus {
        outline: none;
        border-color: $primary;
      }
    }
    
    .btn-primary {
      width: 120px;
      height: 48px;
      background: $primary;
      border: none;
      border-radius: 8px;
      color: white;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.3s;
      
      &:hover:not(:disabled) {
        background: $primary-dark;
      }
      
      &:disabled {
        background: $text-placeholder;
        cursor: not-allowed;
      }
      
      i {
        font-size: 16px;
      }
    }
  }
}

/* 成功提示弹窗 */
.success-toast {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  
  .success-content {
    background: white;
    border-radius: 20px;
    padding: 40px;
    text-align: center;
	width: 400px;  /* 固定宽度，更宽 */
	max-width: 90%;
    animation: popIn 0.3s ease;
    
    i {
      font-size: 64px;
      color: $success;
      margin-bottom: 20px;
    }
    
    p {
      color: $text-primary;
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 32px;
    }
    
    .success-actions {
      display: flex;
      gap: 16px;
      
      .action-btn {
        flex: 1;
        padding: 14px 0;
        border-radius: 12px;
        font-size: 16px;
		 font-weight: 500;
        cursor: pointer;
        transition: all 0.3s;
        
        &.stay {
          background: transparent;
          border: 2px solid $border-color;
          color: $text-regular;
          
          &:hover {
            border-color: $primary;
            color: $primary;
          }
        }
        
        &.go {
          background: $primary;
          border: none;
          color: white;
          
          &:hover {
            background: $primary-dark;
          }
        }
      }
    }
  }
}

/* 动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
  
  .modal-container {
    transition: transform 0.3s ease;
  }
}

.slide-up-enter-from,
.slide-up-leave-to {
  .modal-container {
    transform: translateY(100%);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes slideIn {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes popIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

// 手机适配
@media (max-width: 640px) {
  .modal-container {
    max-width: 100%;
    border-radius: 20px 20px 0 0;
  }
  
  .action-row {
    flex-direction: column;
    
    .category-select {
      width: 100%;
    }
    
    .btn-primary {
      width: 100%;
    }
  }
  
  .success-actions {
    flex-direction: column;
  }
}
</style>