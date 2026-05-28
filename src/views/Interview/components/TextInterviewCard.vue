<!-- src/views/Interview/components/TextInterviewCard.vue -->
<template>
  <div 
    class="text-interview-card" 
    @click="$emit('click')"
    role="button"
    tabindex="0"
  >
    <div class="card-content">
      <!-- 左边文字区域 -->
      <div class="text-wrapper">
        <h2 class="module-title">文字面试</h2>
        <p class="module-subtitle">随时随地在线作答，记录可追溯。</p>
        <!-- <div class="feature-tags">
          <span class="tag">不限地点</span>
          <span class="tag">智能评分</span>
          <span class="tag">历史复盘</span>
        </div> -->
      </div>

      <!-- 右边图片区域 -->
      <div class="image-wrapper">
        <img :src="imageUrl" alt="文字面试预览" class="module-image">
        <!-- 渐变在左边（靠近文字的一侧） -->
        <div class="gradient-overlay left-gradient"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import textImage from '@/assets/images/text.png'

defineProps({
  imageUrl: {
    type: String,
    default: textImage
  }
})

defineEmits(['click'])
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.text-interview-card {
  background: $white;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  border: 3px solid rgb(220, 220, 220);  // 边框颜色和文字颜色一致
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.02);
   
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
      
      &.left-gradient {
        left: 0;
        background: linear-gradient(90deg, 
          $white 0%,
          rgba($white, 0.8) 40%,
          transparent 100%);
      }
    }
  }
  
  .text-wrapper {
    flex: 1;
    color: $text-primary;  // 深灰色文字
    padding: 0 8px 0 40px;
    
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
    
    .feature-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      
      .tag {
        background: rgba($text-primary, 0.08);
        padding: 4px 10px;
        border-radius: 30px;
        font-size: 12px;
        font-weight: 500;
        color: $text-primary;
        border: 1px solid rgba($text-primary, 0.1);
      }
    }
  }
}
</style>