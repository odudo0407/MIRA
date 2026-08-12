<template>
  <section id="contact" class="contact">
    <div class="container">
      <!-- 标题 -->
      <h2 class="section-title">联系我们</h2>
      <p class="section-subtitle">给我们留言</p>
      
      <div class="contact-card">
        <!-- 留言输入框 -->
        <textarea 
          v-model="message"
          placeholder="写下你想说的话..."
          class="message-input"
        ></textarea>
        
        <!-- 发送按钮 -->
        <button class="send-btn" @click="handleSend" :disabled="!message.trim()">
          发送
        </button>
      </div>
    </div>

    <!-- 成功提示弹窗 -->
    <div v-if="showSuccess" class="success-toast">
      消息发送成功！
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const message = ref('')
const showSuccess = ref(false)

const handleSend = () => {
  if (!message.value.trim()) return
  
  // 检查是否登录
  const isLogin = !!localStorage.getItem('user')
  if (!isLogin) {
    router.push('/login')
    return
  }
  
  // 显示成功提示
  showSuccess.value = true
  
  // 清空输入框
  message.value = ''
  
  // 2秒后自动关闭提示
  setTimeout(() => {
    showSuccess.value = false
  }, 1000)
}
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.contact {
  padding: 40px 0 20px;
  background: $white;
  position: relative;
}

.container {
  width: $container-width;
  margin: 0 auto;
  max-width: 800px;
}

.section-title {
  text-align: center;
  font-size: 28px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 8px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 2px;
    background: $primary;
    border-radius: 2px;
  }
}

.section-subtitle {
  text-align: center;
  font-size: 14px;
  color: $text-regular;
  margin-top: 12px;
  margin-bottom: 24px;
}

.contact-card {
  background: $bg-gray;
  border-radius: 16px;
  padding: 24px;
}

.message-input {
  width: 100%;
  height: 120px;
  padding: 12px;
  border: 1px solid $border-color;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  margin-bottom: 20px;
  transition: all 0.3s;
  
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
  
  &::placeholder {
    color: $text-placeholder;
    font-size: 14px;
  }
}

.send-btn {
  display: block;
  width: 100%;
  max-width: 160px;
  margin: 0 auto;
  padding: 10px 30px;
  background: $primary;
  color: white;
  border: none;
  border-radius: 40px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover:not(:disabled) {
    background: $primary-dark;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: $text-placeholder;
    cursor: not-allowed;
  }
}

.footer-copyright {
  text-align: center;
  margin-top: 24px;
  padding: 12px 0 8px;
  font-size: 12px;
  color: $text-secondary;
  border-top: 1px solid rgba($border-color, 0.5);
  letter-spacing: 0.3px;
  
  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 4px;
    background: $primary;
    border-radius: 50%;
    margin-right: 6px;
    vertical-align: middle;
  }
}

.success-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(208, 208, 208);
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  z-index: 1000;
  animation: fadeInOut 1s ease;
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translate(-50%, -40%); }
  10% { opacity: 1; transform: translate(-50%, -50%); }
  90% { opacity: 1; transform: translate(-50%, -50%); }
  100% { opacity: 0; transform: translate(-50%, -60%); }
}

@media (max-width: 768px) {
  .contact {
    padding: 30px 0 15px;
  }
  
  .section-title {
    font-size: 22px;
  }
  
  .section-subtitle {
    font-size: 13px;
    margin-bottom: 20px;
  }
  
  .contact-card {
    padding: 20px;
  }
  
  .message-input {
    height: 100px;
    font-size: 14px;
  }
  
  .send-btn {
    max-width: 100%;
    padding: 12px;
  }
  
  .footer-copyright {
    font-size: 11px;
    padding: 10px 0 6px;
    margin-top: 20px;
  }
}
</style>