<template>
  <div class="interview">
    <NavBar />
    <div class="interview-content">
      <!-- 白色容器 - 紧接导航栏下方 -->
      <div class="white-card" :class="{ 'expanded': isExpanded }">
        <!-- 返回按钮 - 放在白色容器右上角 -->
        <transition name="fade">
          <button v-if="isExpanded" class="close-btn" @click="handleClose">
            <i class="fas fa-times"></i>
          </button>
        </transition>

        <!-- 标题组件 - 展开时隐藏 -->
        <ModuleTitle v-if="!isExpanded" class="title-in-card" />

        <!-- 展开状态：左边半圆 + 右边扇形按钮 -->
        <div v-if="isExpanded" class="expanded-layout">
          <!-- 左边：半圆图片（贴紧白色容器左边） -->
          <transition name="slide-left">
            <div v-if="showSemiCircle" class="semi-circle">
              <img :src="expandedMode === 'video' ? humanImage : textImage" alt="面试" class="semi-circle-image">
            </div>
          </transition>

          <!-- 右边：扇形按钮区域 -->
          <div class="fan-section" v-if="showJobButtons">
            <!-- 提示文字 -->
            <div class="fan-title">请选择面试岗位</div>
            
            <!-- 三个岗位扇形按钮 -->
            <transition-group name="fan" tag="div" class="fan-buttons">
              <!-- Java - 左上 -->
              <div
                key="java"
                class="fan-button java-btn"
                :style="{ animationDelay: '0.3s' }"
                @click="selectJob(currentJobOptions[0])"
              >
                <img :src="currentJobOptions[0].icon" alt="Java" class="fan-icon" />
                <span class="fan-name">{{ currentJobOptions[0].shortName }}</span>
              </div>
              
              <!-- Web - 中间 -->
              <div
                key="web"
                class="fan-button web-btn"
                :style="{ animationDelay: '0.45s' }"
                @click="selectJob(currentJobOptions[1])"
              >
                <img :src="currentJobOptions[1].icon" alt="Web" class="fan-icon" />
                <span class="fan-name">{{ currentJobOptions[1].shortName }}</span>
              </div>
              
              <!-- Python - 右下 -->
              <div
                key="python"
                class="fan-button python-btn"
                :style="{ animationDelay: '0.6s' }"
                @click="selectJob(currentJobOptions[2])"
              >
                <img :src="currentJobOptions[2].icon" alt="Python" class="fan-icon" />
                <span class="fan-name">{{ currentJobOptions[2].shortName }}</span>
              </div>
            </transition-group>
          </div>
        </div>

        <!-- 收起状态：两个面试模块并排 -->
        <div v-else class="modules-container">
          <div class="video-card-wrapper">
            <DigitalHumanCard :expanded="false" @click="handleVideoClick" />
          </div>
          <div class="text-card-wrapper">
            <TextInterviewCard @click="handleTextClick" />
          </div>
        </div>
      </div>
    </div>
    <FooterSection />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/views/Home/components/NavBar.vue'
import FooterSection from '@/views/Home/components/FooterSection.vue'
import ModuleTitle from './components/ModuleTitle.vue'
import DigitalHumanCard from './components/DigitalHumanCard.vue'
import TextInterviewCard from './components/TextInterviewCard.vue'
import humanImage from '@/assets/images/human.png'
import textImage from '@/assets/images/text.png'

const router = useRouter()

// ==================== 状态管理 ====================
const isExpanded = ref(false)        // 是否展开
const expandedMode = ref('')          // 展开模式：'video' 或 'text'
const showSemiCircle = ref(false)    // 是否显示半圆
const showJobButtons = ref(false)    // 是否显示岗位按钮

// ==================== 岗位数据 ====================
const videoJobOptions = [
  {
    id: 'java',
    name: 'Java后端',
    shortName: 'Java后端',
    icon: '/src/assets/images/java.png',
    path: '/interview/digital-human?job=java'
  },
  {
    id: 'frontend',
    name: 'Web前端',
    shortName: 'Web前端',
    icon: '/src/assets/images/web.png',
    path: '/interview/digital-human?job=frontend'
  },
  {
    id: 'python',
    name: 'Python算法',
    shortName: 'Python算法',
    icon: '/src/assets/images/python.png',
    path: '/interview/digital-human?job=python'
  }
]

const textJobOptions = [
  {
    id: 'java-text',
    name: 'Java后端',
    shortName: 'Java后端',
    icon: '/src/assets/images/java.png',
    path: '/interview/text?job=java'
  },
  {
    id: 'frontend-text',
    name: 'Web前端',
    shortName: 'Web前端',
    icon: '/src/assets/images/web.png',
    path: '/interview/text?job=frontend'
  },
  {
    id: 'python-text',
    name: 'Python算法',
    shortName: 'Python算法',
    icon: '/src/assets/images/python.png',
    path: '/interview/text?job=python'
  }
]

// 根据展开模式选择对应的岗位数据
const currentJobOptions = computed(() => {
  return expandedMode.value === 'video' ? videoJobOptions : textJobOptions
})

// ==================== 交互方法 ====================

// 处理视频面试点击
const handleVideoClick = () => {
  if (isExpanded.value) return
  
  // 设置展开模式为视频
  expandedMode.value = 'video'
  
  // 展开
  isExpanded.value = true
  
  // 先显示半圆
  setTimeout(() => {
    showSemiCircle.value = true
  }, 100)
  
  // 延迟显示岗位按钮
  setTimeout(() => {
    showJobButtons.value = true
  }, 150)
}

// 处理文字面试点击
const handleTextClick = () => {
  if (isExpanded.value) return
  
  // 设置展开模式为文字
  expandedMode.value = 'text'
  
  // 展开
  isExpanded.value = true
  
  // 先显示半圆
  setTimeout(() => {
    showSemiCircle.value = true
  }, 100)
  
  // 延迟显示岗位按钮
  setTimeout(() => {
    showJobButtons.value = true
  }, 150)
}

// 选择岗位
const selectJob = (job) => {
  const routeData = router.resolve(job.path)
  window.open(routeData.href, '_blank')
}

// 处理关闭按钮点击
const handleClose = () => {
  // 岗位按钮消失
  showJobButtons.value = false
  showSemiCircle.value = false
  
  // 卡片收回
  setTimeout(() => {
    isExpanded.value = false
    expandedMode.value = ''
  }, 250)
}

// 在新标签页打开链接
const openInNewTab = (path) => {
  const routeData = router.resolve(path)
  window.open(routeData.href, '_blank')
}
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.interview {
  background: $bg-body;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .interview-content {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 20px 0;
  }

  // 白色容器 - 紧接导航栏下方
  .white-card {
    background: white;
    width: 70%;
    max-width: 1000px;
    margin: 0 auto;
    height: 500px;
    position: relative;
    padding: 0px;
    
    // 右上角关闭按钮
    .close-btn {
      position: absolute;
      top: 30px;
      right: 30px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: $primary;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 30;
      
      &:hover {
        background: $primary-dark;
        transform: scale(1.1);
      }
    }
    
    // 标题在卡片内
    .title-in-card {
      margin-top: 20px;
    }
    
    // 收起状态：两列并排
    .modules-container {
      display: flex;
      flex-direction: column;
      gap: 32px;
      max-width: 1000px;
      margin: 40px auto 0;
      
      .video-card-wrapper,
      .text-card-wrapper {
        width: 100%;
      }
    }
    
    // 展开状态
    .expanded-layout {
      position: relative;
      height: 100%;
      width: 100%;
      
      // 左边半圆 - 贴紧白色容器左边
      .semi-circle {
        position: absolute;
        left: 0px;
        top: 0;
        bottom: 0;
        width: 35%;
        background: $white;
        border-radius: 0 250px 250px 0;
        overflow: hidden;
        border: 3px solid $primary;
        border-left: none;
        height: 500px;
        
        .semi-circle-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
      }
      
      // 右边扇形区域
      .fan-section {
        position: absolute;
        right: 15%;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        
        // 提示文字
        .fan-title {
          color: $primary;
          font-size: 20px;
          font-weight: 600;
          text-align: center;
          margin-bottom: 10px;
          white-space: nowrap;
        }
        
        // 扇形按钮容器
        .fan-buttons {
          position: relative;
          width: 400px;
          height: 400px;
          
          .fan-button {
            position: absolute;
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            gap: 40px;
            opacity: 0;
            animation: fanIn 0.5s forwards;
            cursor: pointer;
            
            &:hover {
              .fan-icon {
                transform: scale(1.1);
                border-color: $primary;
              }
              
              .fan-name {
                font-size: 18px;
                font-weight: 700;
              }
            }
            
            .fan-icon {
              width: 100px;
              height: 100px;
              border-radius: 50%;
              border: 3px solid $border-color;
              object-fit: cover;
              transition: all 0.3s;
              background: white;
              padding: 12px;
            }
            
            .fan-name {
              color: $primary;
              font-size: 16px;
              font-weight: 500;
              text-align: center;
              transition: all 0.3s ease;
              white-space: nowrap;
            }
            
            // Java按钮 - 左上
            &.java-btn {
              top: 1%;
              right: 35%;
            }
            
            // Web按钮 - 中间偏右
            &.web-btn {
              top: 30%;
              right: 15%;
            }
            
            // Python按钮 - 右下
            &.python-btn {
              top: 59%;
              right: 35%;
            }
          }
        }
      }
    }
  }
}

// 扇形飞入动画
@keyframes fanIn {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.7);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

// 左边半圆滑入动画
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.4s ease;
}
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}
.slide-left-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.slide-left-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

// 岗位按钮过渡
.fan-enter-active,
.fan-leave-active {
  transition: all 0.3s ease;
}
.fan-enter-from,
.fan-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.7);
}

// 关闭按钮淡入淡出
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 手机适配
@media (max-width: 768px) {
  .interview {
    .white-card {
      width: 90%;
      height: 450px;
      padding: 20px;
      
      .close-btn {
        top: 20px;
        right: 20px;
        width: 36px;
        height: 36px;
        font-size: 18px;
      }
      
      .expanded-layout {
        .semi-circle {
          left: -20px;
          width: 40%;
          border-radius: 0 150px 150px 0;
          height: 450px;
        }
        
        .fan-section {
          right: 2%;
          
          .fan-title {
            font-size: 18px;
          }
          
          .fan-buttons {
            width: 250px;
            height: 250px;
            
            .fan-button {
              .fan-icon {
                width: 70px;
                height: 70px;
                padding: 8px;
              }
              
              .fan-name {
                font-size: 13px;
              }
              
              &.java-btn {
                top: 5%;
                right: 30%;
              }
              
              &.web-btn {
                top: 35%;
                right: 10%;
              }
              
              &.python-btn {
                top: 65%;
                right: 20%;
              }
            }
          }
        }
      }
    }
  }
}
</style>