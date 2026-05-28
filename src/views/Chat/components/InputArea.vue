<template>
  <div class="input-area">
    <div class="input-container">
      <textarea
        ref="textareaRef"
        v-model="message"
        placeholder="输入消息... (Enter 发送，Shift + Enter 换行)"
        @keydown.enter.prevent="handleEnter"
        :disabled="disabled"
        rows="1"
      ></textarea>
      
      <button 
        class="send-btn" 
        @click="sendMessage"
        :disabled="!message.trim() || disabled"
      >
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
    
    <div v-if="disabled" class="input-tip">
      请先选择一个对话
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  disabled: Boolean
})
const emit = defineEmits(['send'])

const message = ref('')
const textareaRef = ref(null)

// 自动调整高度
const adjustHeight = () => {
  const textarea = textareaRef.value
  if (textarea) {
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }
}

watch(message, adjustHeight)

const handleEnter = (e) => {
  if (e.shiftKey) {
    // Shift + Enter 换行
    message.value += '\n'
  } else {
    // Enter 发送
    sendMessage()
  }
}

const sendMessage = () => {
  if (!message.value.trim() || props.disabled) return
  
  emit('send', message.value)
  message.value = ''
  
  // 重置高度
  setTimeout(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
    }
  }, 0)
}
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.input-area {
  padding: 20px;
  border-top: 1px solid $border-light;
  background: $white;
}

.input-container {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  
  textarea {
    flex: 1;
    padding: 12px;
    border: 1px solid $border-color;
    border-radius: 24px;
    resize: none;
    font-size: 14px;
    line-height: 1.5;
    max-height: 120px;
    transition: all 0.3s;
    
    &:focus {
      outline: none;
      border-color: $primary;
    }
    
    &:disabled {
      background: $bg-gray;
      cursor: not-allowed;
    }
  }
  
  .send-btn {
    width: 44px;
    height: 44px;
    background: $primary;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    
    &:hover:not(:disabled) {
      background: $primary-dark;
      transform: scale(1.05);
    }
    
    &:disabled {
      background: $text-placeholder;
      cursor: not-allowed;
    }
    
    i {
      font-size: 18px;
    }
  }
}

.input-tip {
  margin-top: 8px;
  font-size: 12px;
  color: $text-secondary;
  text-align: center;
}
</style>