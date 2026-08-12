<template>
  <div class="message-list" ref="listRef">
    <div v-if="messages.length === 0" class="empty-state">
      <i class="fas fa-comment-dots"></i>
      <p>开始新的对话吧～</p>
    </div>
    
    <template v-else>
      <MessageItem 
        v-for="msg in messages" 
        :key="msg.id"
        :message="msg"
      />
    </template>
    
    <div v-if="loading" class="loading-indicator">
      <div class="typing">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import MessageItem from './MessageItem.vue'

const props = defineProps({
  messages: Array,
  loading: Boolean
})

const listRef = ref(null)

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (listRef.value) {
      listRef.value.scrollTop = listRef.value.scrollHeight
    }
  })
}

// 监听消息变化，自动滚动
watch(() => props.messages, scrollToBottom, { deep: true })
watch(() => props.loading, scrollToBottom)
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: $text-secondary;
  
  i {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  p {
    font-size: 14px;
  }
}

.loading-indicator {
  display: flex;
  justify-content: flex-start;
  padding: 10px 0;
}

.typing {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: $bg-gray;
  border-radius: 18px 18px 18px 4px;
  
  span {
    width: 6px;
    height: 6px;
    background: $text-secondary;
    border-radius: 50%;
    animation: typing 1.4s infinite;
    
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
  30% { transform: translateY(-4px); opacity: 1; }
}
</style>