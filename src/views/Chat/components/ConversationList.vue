<!-- src/views/Chat/components/ConversationList.vue -->
<template>
  <div class="conversation-list">
    <div class="list-header">
      <h3>对话列表</h3>
      <button class="new-btn" @click="$emit('new')">
        <i class="fas fa-plus"></i> 新建对话
      </button>
    </div>
    
    <div class="list-content">
      <div 
        v-for="conv in conversations" 
        :key="conv.id"
        class="conversation-item"
        :class="{ 
          active: currentId === conv.id,
          'menu-active': activeMenuId === conv.id
        }"
        @click="selectConversation(conv)"
      >
        <!-- 未读消息气泡 - 移到左上角 -->
        <div v-if="conv.unread > 0" class="unread-badge">
          {{ conv.unread > 99 ? '99+' : conv.unread }}
        </div>
        
        <div class="item-avatar">
          <i class="fas fa-comment-dots"></i>
        </div>
        
        <div class="item-info">
          <div class="item-header">
            <span class="item-title">{{ conv.title }}</span>
            <div class="item-right">
              <span class="item-time">{{ conv.time }}</span>
              <button 
                class="menu-btn" 
                @click.stop="toggleMenu(conv.id)"
                v-if="currentId === conv.id"
              >
                <i class="fas fa-ellipsis-v"></i>
              </button>
            </div>
          </div>
          <p class="item-preview">{{ conv.lastMessage || '新对话' }}</p>
        </div>
        
        <!-- 删除按钮（滑动露出）- 固定在右侧外部 -->
        <div 
          v-if="activeMenuId === conv.id" 
          class="delete-btn"
          @click.stop="$emit('delete', conv.id)"
        >
          <img src="@/assets/images/delete.png" alt="删除" class="delete-icon">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  conversations: Array,
  currentId: Number
})
const emit = defineEmits(['select', 'new', 'delete'])

// 当前显示菜单的对话ID
const activeMenuId = ref(null)

// 切换菜单显示
const toggleMenu = (id) => {
  if (activeMenuId.value === id) {
    activeMenuId.value = null  // 如果已打开，则关闭
  } else {
    activeMenuId.value = id  // 否则打开
  }
}

// 选择对话
const selectConversation = (conv) => {
  // 如果点击的不是当前选中的对话，才触发选中事件
  if (props.currentId !== conv.id) {
    emit('select', conv.id)
  }
  // 关闭菜单
  activeMenuId.value = null
}
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.conversation-list {
  width: 280px;
  background: $white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.list-header {
  padding: 20px;
  border-bottom: 1px solid $border-light;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    color: $text-primary;
    font-size: 16px;
  }
  
  .new-btn {
    background: transparent;
    border: 1px solid $primary;
    color: $primary;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      background: $primary;
      color: white;
    }
  }
}

.list-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.conversation-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
  position: relative;
  overflow: visible;
  background: $white;
  
  &:hover {
    background: $bg-gray;
  }
  
  &.active {
    background: rgba($primary, 0.1);
    
    .item-title {
      color: $primary;
      font-weight: 600;
    }
  }
  
  &.menu-active {
    transform: translateX(-40px);
  }
}

/* 未读消息气泡 - 移到左上角 */
.unread-badge {
  position: absolute;
  top: -4px;
  left: -4px;
  min-width: 18px;
  height: 18px;
  background: $primary;
  color: white;
  font-size: 11px;
  font-weight: 500;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  z-index: 10;
  border: 2px solid $white; /* 加个白边，更明显 */
}

.item-avatar {
  width: 40px;
  height: 40px;
  background: $bg-gray;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $primary;
  font-size: 18px;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.item-title {
  color: $text-primary;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.item-time {
  color: $text-secondary;
  font-size: 11px;
  white-space: nowrap;
}

.menu-btn {
  background: transparent;
  border: none;
  color: $text-regular;
  cursor: pointer;
  padding: 2px 4px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: $primary;
  }
}

.item-preview {
  color: $text-regular;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 30px;
}

/* 删除按钮 - 固定在对话项的右侧外部 */
.delete-btn {
  position: absolute;
  left: 100%;
  top: 0;
  width: 40px;
  height: 100%;
  background: $primary;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 0 8px 8px 0;
  
  &:hover {
    background: $primary-dark;
  }
  
  .delete-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
    filter: brightness(0) invert(1);
  }
}
</style>