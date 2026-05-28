<template>
  <div 
    class="digital-human-card" 
    :class="{ 'expanded-mode': expanded }"
    @click="$emit('click')"
    role="button"
    tabindex="0"
  >
    <div class="card-content">
      <!-- 左边图片区域 - 这个会变成圆形按钮 -->
      <div class="image-wrapper" :class="{ 'circle-mode': expanded }">
        <img :src="imageUrl" alt="视频面试" class="module-image">
        <div class="gradient-overlay right-gradient" v-if="!expanded"></div>
      </div>
      
      <!-- 右边文字区域 - 展开时隐藏 -->
      <div class="text-wrapper" v-if="!expanded">
        <h2 class="module-title">{{ title }}</h2>
        <p class="module-subtitle">{{ subtitle }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import humanImage from '@/assets/images/human.png'

defineProps({
  imageUrl: {
    type: String,
    default: humanImage
  },
  title: {
    type: String,
    default: '视频面试'
  },
  subtitle: {
    type: String,
    default: '沉浸式面试交互，打造身临其境的面试体验。'
  },
  expanded: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.digital-human-card {
  background: $white;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  border: 3px solid rgb(220, 220, 220);
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  
  &:hover {
    transform: scale(1.02);
  }
  
  &.expanded-mode {
    background: transparent;
    border: none;
    
    .image-wrapper {
      width: 180px;
      height: 180px;
      margin: 0 auto;
      
      &.circle-mode {
        border-radius: 50%;
        border: 3px solid $primary;
      }
      
      .gradient-overlay {
        display: none;
      }
    }
  }
  
  .card-content {
    display: flex;
    align-items: center;
    padding: 0;
    height: 160px;
  }
  
  .image-wrapper {
    position: relative;
    border-radius: 0;
    overflow: hidden;
    width: 160px;
    height: 160px;
    flex-shrink: 0;
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    
    .module-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    
    .gradient-overlay {
      position: absolute;
      top: 0;
      width: 50%;
      height: 100%;
      pointer-events: none;
      
      &.right-gradient {
        right: 0;
        background: linear-gradient(270deg, 
          $white 0%,
          rgba($white, 0.8) 40%,
          transparent 100%);
      }
    }
  }
  
  .text-wrapper {
    flex: 1;
    color: $text-primary;
    padding: 0 40px 0 10px;
    text-align: right;
    
    .module-title {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 6px;
      line-height: 1.2;
      color: $text-primary;
    }
    
    .module-subtitle {
      font-size: 13px;
      margin-bottom: 12px;
      opacity: 0.9;
      line-height: 1.4;
      color: $text-primary;
    }
  }
}
</style>