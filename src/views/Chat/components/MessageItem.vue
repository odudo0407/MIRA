<!-- src/views/Chat/components/MessageItem.vue -->
<template>
  <div class="message-item" :class="{ 'user-message': message.role === 'user' }">
    <div class="message-avatar">
      <img 
        v-if="message.role === 'assistant'" 
        src="/src/assets/images/ai.png" 
        alt="AI"
      >
      <i v-else class="fas fa-user"></i>
    </div>
    
    <div class="message-bubble">
      <div class="message-content">{{ message.content }}</div>
      <div class="message-time">{{ message.time }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: Object
})
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.message-item {
  display: flex;
  gap: 12px;
  max-width: 80%;
  
  &.user-message {
    margin-left: auto;
    flex-direction: row-reverse;
    
    .message-bubble {
      background: $primary;
      color: white;
      border-radius: 18px 4px 18px 18px;
    }
    
    .message-time {
      text-align: right;
      color: rgba(255, 255, 255, 0.7);
    }
  }
}

.message-avatar {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
  
  i {
    width: 36px;
    height: 36px;
    background: $bg-gray;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $primary;
    font-size: 18px;
  }
}

.message-bubble {
  background: $bg-gray;
  padding: 12px 16px;
  border-radius: 4px 18px 18px 18px;
  max-width: 100%;
  word-wrap: break-word;
}

.message-content {
  font-size: 14px;
  line-height: 1.6;
  color: $text-primary;
  white-space: pre-wrap;
}

.message-time {
  font-size: 11px;
  color: $text-secondary;
  margin-top: 4px;
}

.user-message {
  .message-content {
    color: white;
  }
}
</style>