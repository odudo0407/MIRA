<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showButton = ref(false)

const handleScroll = () => {
  showButton.value = window.scrollY > 100
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <Transition name="fade">
    <button 
      v-if="showButton" 
      class="back-to-top"
      @click="scrollToTop"
      aria-label="回到顶部"
    >
      <i class="fas fa-arrow-up"></i>
    </button>
  </Transition>
</template>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.back-to-top {
  position: fixed;
  bottom: 5rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: $primary;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  z-index: 100;
  box-shadow: none; /* 确保没有阴影 */

  &:hover {
    background: $primary-dark;
    transform: translateY(-3px);
    box-shadow: none; /* 确保悬停时也没有阴影 */
  }

  &:active {
    transform: translateY(0);
    box-shadow: none; /* 确保点击时也没有阴影 */
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
</style>