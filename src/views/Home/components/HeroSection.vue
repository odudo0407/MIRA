<script setup>
import { useRouter } from 'vue-router'

defineProps({
  title: String,
  subtitle: String
})

const router = useRouter()

const goToInterview = () => {
  router.push('/interview')
}

const scrollToFeatures = () => {
  // 改为指向热点推荐区域
  const hotSection = document.querySelector('.hot-recommend')
  if (hotSection) {
    hotSection.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <section id="hero" class="hero">
    <!-- 图片容器，用于定位遮罩 -->
    <div class="image-container">
      <!-- 半透明遮罩层 - 只覆盖图片区域 -->
      <div class="overlay"></div>
    </div>
    
    <!-- 文字内容 -->
    <div class="content">
      <h1 class="title">MIRA</h1>
      <p class="subtitle">你的AI面试官，让面试更简单</p>
      
      <!-- 开始按钮 -->
      <button class="start-btn" @click="goToInterview">
        开始模拟面试
      </button>
      
      <!-- 下滑发现更多（跳动） -->
      <div class="scroll-down" @click="scrollToFeatures">
        <span class="scroll-text">下滑发现更多</span>
        <i class="fas fa-chevron-down scroll-icon"></i>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.hero {
  position: relative;
  width: 100%;
  min-height: 482px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 图片容器 - 用于定位遮罩
.image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/home-hero.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

// 半透明遮罩 - 只覆盖图片区域
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(76, 76, 76, 0.4);
  z-index: 1;
  // 遮罩只覆盖图片区域，通过和图片相同的background属性来实现
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  // 让遮罩的形状和图片一样
  mask-image: url('@/assets/images/home-hero.png');
  mask-size: contain;
  mask-position: center;
  mask-repeat: no-repeat;
  -webkit-mask-image: url('@/assets/images/home-hero.png');
  -webkit-mask-size: contain;
  -webkit-mask-position: center;
  -webkit-mask-repeat: no-repeat;
}

// 文字内容
.content {
  position: relative;
  text-align: center;
  z-index: 2;
  width: 100%;
  padding: 0 20px;
  color: white;
  
  .title {
    font-size: 80px;
    font-weight: 700;
    margin-bottom: 20px;
    letter-spacing: 4px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
  
  .subtitle {
    font-size: 24px;
    font-weight: 400;
    letter-spacing: 2px;
    margin-bottom: 30px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
  
  // 开始按钮
  .start-btn {
    display: inline-block;
    padding: 12px 40px;
    font-size: 24px;
    font-weight: 400;
    color: white;
    background: rgba(111, 111, 111, 0.4);
    border: 4px solid white;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    letter-spacing: 2px;
    margin-bottom: 60px;
    
    &:hover {
      background: rgba(166, 166, 166, 0.4);
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
  
  // 下滑发现更多（跳动）
  .scroll-down {
    position: absolute;
    bottom: -80px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    animation: bounce 2s infinite;
    
    .scroll-text {
      font-size: 14px;
      color: white;
      letter-spacing: 2px;
      opacity: 0.8;
      transition: opacity 0.3s;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    }
    
    .scroll-icon {
      font-size: 20px;
      color: white;
      opacity: 0.8;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    }
    
    &:hover {
      .scroll-text, .scroll-icon {
        opacity: 1;
      }
    }
  }
}

// 跳动动画
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

// 手机适配
@media (max-width: 768px) {
  .hero {
    min-height: 400px;
  }
  
  .content {
    .title {
      font-size: 48px;
    }
    
    .subtitle {
      font-size: 18px;
      margin-bottom: 20px;
    }
    
    .start-btn {
      font-size: 18px;
      padding: 10px 30px;
      margin-bottom: 40px;
    }
    
    .scroll-down {
      bottom: -60px;
      
      .scroll-text {
        font-size: 12px;
      }
      
      .scroll-icon {
        font-size: 16px;
      }
    }
  }
}
</style>