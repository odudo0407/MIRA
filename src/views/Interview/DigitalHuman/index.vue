<!-- src/views/Interview/DigitalHuman/index.vue -->
<template>
  <div class="digital-human-interview">
    <NavBar />
    
    <!-- 上传简历弹窗 -->
    <transition name="fade">
      <div v-if="showResumeModal" class="modal-overlay">
        <div class="modal-container">
          <!-- 第一步：上传简历 -->
          <div v-if="!resumeUploaded" class="modal-step">
            <h3 class="modal-title">上传简历</h3>
            
            <div 
              class="upload-area"
              @dragover.prevent
              @dragenter.prevent
              @dragleave="dragLeave"
              @drop="handleDrop"
              :class="{ 'drag-over': isDragOver }"
            >
              <i class="fas fa-cloud-upload-alt upload-icon"></i>
              <p class="upload-text">点击或拖拽文件到此区域上传</p>
              <p class="upload-hint">支持 PDF、DOC、DOCX 格式，文件大小不超过10MB</p>
              
              <input 
                type="file" 
                ref="fileInput"
                class="file-input"
                accept=".pdf,.doc,.docx"
                @change="handleFileSelect"
              >
              
              <button class="select-file-btn" @click="triggerFileSelect">选择文件</button>
            </div>
            
            <div v-if="uploadProgress > 0" class="progress-bar">
              <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
              <span class="progress-text">{{ uploadProgress }}%</span>
            </div>
            
            <div v-if="uploadError" class="error-message">
              <i class="fas fa-exclamation-circle"></i> {{ uploadError }}
            </div>
            
            <!-- 跳过按钮 -->
            <div class="skip-section">
              <button class="skip-btn" @click="skipUpload">
                跳过，直接开始面试
              </button>
            </div>
          </div>
          
          <!-- 第二步：准备就绪 -->
          <div v-else class="modal-step ready-step">
            <div class="success-icon">
              <i class="fas fa-check-circle"></i>
            </div>
            <h3 class="modal-title">准备就绪</h3>
            <p class="file-info">{{ uploadedFileName || '已跳过上传' }}</p>
            <button class="start-btn-large" @click="startInterviewFromModal">开始面试</button>
          </div>
        </div>
      </div>
    </transition>

    <div class="main-content">
      <div class="container">
        <!-- 顶部信息栏 -->
        <div class="top-bar">
          <div class="left-section">
            <div class="job-info">
              <span class="label">岗位：</span>
              <span class="value">{{ jobName }}</span>
            </div>
            
            <div class="timer">
              <i class="far fa-clock"></i>
              <span class="time">{{ formattedTime }}</span>
            </div>
          </div>
          
          <div class="action-buttons">
            <!-- 加6题按钮 - 点击一次后禁用 -->
            <button 
              class="add-questions-btn" 
              @click="addSixQuestions"
              :disabled="hasAddedSixQuestions"
            >
              <i class="fas fa-plus-circle"></i> 加6题
            </button>
            
            <!-- 开始面试按钮 - 只在面试开始前显示 -->
            <button 
              v-if="!interviewStarted"
              class="start-btn" 
              @click="startInterview"
            >
              <i class="fas fa-play"></i> 开始面试
            </button>
            
            <!-- 结束面试按钮 - 只在面试进行中显示 -->
            <button 
              v-if="interviewStarted"
              class="end-btn" 
              @click="endInterview"
            >
              <i class="fas fa-stop"></i> 结束面试
            </button>
          </div>
        </div>
        
        <!-- 视频区域 -->
        <div class="video-section">
          <!-- 左侧：数字人面试官 -->
          <div class="video-container left">
            <div class="video-label">AI面试官</div>
            <div class="video-placeholder">
              <div class="avatar-icon">🤖</div>
              <p>{{ jobName }} 面试官</p>
              <span class="status-tag" :class="{ active: interviewStarted }">
                {{ interviewStarted ? '面试中' : '等待开始' }}
              </span>
            </div>
          </div>
          
          <!-- 右侧：面试者视频 -->
          <div class="video-container right">
            <div class="video-label">我</div>
            <div class="video-placeholder">
              <div class="avatar-icon">👤</div>
              <p>{{ interviewStarted ? '摄像头已开启' : '等待开始面试' }}</p>
              <span class="status-tag" :class="{ active: interviewStarted }">
                {{ interviewStarted ? '连接中' : '未开启' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FooterSection />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavBar from '@/views/Home/components/NavBar.vue'
import FooterSection from '@/views/Home/components/FooterSection.vue'
import { interviewRecords, currentUser } from '@/shared/data.js'

const router = useRouter()
const route = useRoute()

// ==================== 获取岗位参数 ====================
const jobId = ref(route.query.job || 'frontend')
const jobName = ref(route.query.jobName || 'Web前端')

// ==================== 弹窗状态 ====================
const showResumeModal = ref(false)
const isDragOver = ref(false)
const fileInput = ref(null)
const uploadProgress = ref(0)
const uploadError = ref('')
const resumeUploaded = ref(false)
const uploadedFileName = ref('')

// ==================== 面试状态 ====================
const interviewStarted = ref(false)
const canStartInterview = ref(false)
const startTime = ref(null)
const timerInterval = ref(null)
const elapsedSeconds = ref(0)

// ==================== 问题数量控制 ====================
const questionCount = ref(5) // 默认5题
const hasAddedSixQuestions = ref(false) // 是否已经加过6题

// ==================== 模拟问题列表 ====================
const baseQuestionBank = {
  java: [
    '请介绍一下Java中的垃圾回收机制。',
    '什么是Spring Boot的核心特性？',
    '请解释一下Java中的多线程实现方式。',
    '谈谈你对微服务架构的理解。',
    'JVM内存模型是怎样的？'
  ],
  frontend: [
    '请介绍一下Vue3的响应式原理。',
    '什么是闭包？实际开发中有哪些应用场景？',
    '请解释一下浏览器渲染流程。',
    'Vue和React有什么区别？',
    '什么是虚拟DOM？它有什么优势？'
  ],
  python: [
    'Python中的装饰器是什么？有什么用途？',
    '请解释一下GIL锁对Python多线程的影响。',
    '什么是列表推导式？请举例说明。',
    'Django和Flask有什么区别？',
    'Python中的生成器是什么？有什么作用？'
  ]
}

const extraQuestions = {
  java: [
    'Java中的反射机制是什么？有什么应用场景？',
    '什么是设计模式？请举例说明几种常用的设计模式。',
    'Java 8的新特性有哪些？',
    '什么是分布式系统？有哪些挑战？',
    '如何优化Java应用的性能？',
    '什么是微服务？和单体架构有什么区别？'
  ],
  frontend: [
    '什么是跨域？如何解决？',
    '前端性能优化有哪些方法？',
    '什么是Webpack？它的工作原理是什么？',
    '谈谈你对前端工程化的理解。',
    '什么是HTTP和HTTPS的区别？',
    '什么是PWA？它有什么特点？'
  ],
  python: [
    '什么是Django的ORM？如何使用？',
    'Python中的多线程和多进程有什么区别？',
    '什么是Flask？和Django有什么区别？',
    '什么是RESTful API？如何设计？',
    'Python中的异常处理机制是怎样的？',
    '什么是单元测试？如何在Python中进行单元测试？'
  ]
}

// ==================== 计时器格式化 ====================
const formattedTime = computed(() => {
  const hours = Math.floor(elapsedSeconds.value / 3600)
  const minutes = Math.floor((elapsedSeconds.value % 3600) / 60)
  const seconds = elapsedSeconds.value % 60
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  } else {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
})

// ==================== 弹窗方法 ====================

// 打开上传简历弹窗
const openResumeModal = () => {
  showResumeModal.value = true
  uploadProgress.value = 0
  uploadError.value = ''
}

// 关闭弹窗
const closeModal = () => {
  showResumeModal.value = false
}

// 触发文件选择
const triggerFileSelect = () => {
  fileInput.value.click()
}

// 处理文件选择
const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (file) {
    uploadFile(file)
  }
}

// 处理拖拽
const handleDrop = (e) => {
  e.preventDefault()
  isDragOver.value = false
  
  const file = e.dataTransfer.files[0]
  if (file) {
    uploadFile(file)
  }
}

const dragLeave = () => {
  isDragOver.value = false
}

// 上传文件（模拟）- 优化速度
const uploadFile = (file) => {
  const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  if (!validTypes.includes(file.type)) {
    uploadError.value = '请上传 PDF 或 Word 格式的简历'
    return
  }
  
  if (file.size > 10 * 1024 * 1024) {
    uploadError.value = '文件大小不能超过 10MB'
    return
  }
  
  uploadError.value = ''
  uploadedFileName.value = file.name
  
  uploadProgress.value = 0
  const interval = setInterval(() => {
    if (uploadProgress.value < 100) {
      uploadProgress.value += 20 // 每次增加20%，更快
    } else {
      clearInterval(interval)
      // 减少延迟时间
      setTimeout(() => {
        resumeUploaded.value = true
        canStartInterview.value = true
      }, 100) // 从500ms改为100ms
    }
  }, 100) // 从200ms改为100ms
}

// 跳过上传
const skipUpload = () => {
  uploadedFileName.value = '已跳过上传'
  resumeUploaded.value = true
  canStartInterview.value = true
}

// 从弹窗开始面试
const startInterviewFromModal = () => {
  closeModal()
  startInterview()
}

// ==================== 加6题方法 ====================
const addSixQuestions = () => {
  if (hasAddedSixQuestions.value) return // 已经加过就不执行
  
  questionCount.value = 11
  hasAddedSixQuestions.value = true
  console.log('已增加6个问题，总题数：11')
  // TODO: 接后端后，这里调用API增加6个问题
  alert('已增加6个问题')
}

// ==================== 面试方法 ====================

// 开始面试 - 优化速度
const startInterview = () => {
  if (!canStartInterview.value) return
  
  interviewStarted.value = true
  startTime.value = Date.now()
  
  timerInterval.value = setInterval(() => {
    if (startTime.value) {
      elapsedSeconds.value = Math.floor((Date.now() - startTime.value) / 1000)
    }
  }, 1000)
  
  console.log('面试开始，题目数量：', questionCount.value)
  // TODO: 数字人开始提问
}

// 结束面试 - 优化速度
const endInterview = () => {
  if (!interviewStarted.value) return
  
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
  
  const interviewRecord = {
    id: Date.now(),
    type: 'video',
    date: new Date().toLocaleDateString('zh-CN'),
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    topic: `${jobName.value}视频面试`,
    duration: elapsedSeconds.value,
    rounds: 0,
    score: 4.2,
    tags: [jobName.value, '视频面试'],
    strengths: ['回答流畅', '技术基础扎实'],
    weaknesses: ['需要加强项目经验描述'],
    conversation: []
  }
  
  interviewRecords.value.unshift(interviewRecord)
  
  interviewStarted.value = false
  canStartInterview.value = false
  resumeUploaded.value = false
  elapsedSeconds.value = 0
  
  // 减少跳转延迟
  setTimeout(() => {
    router.push('/profile/interviews')
  }, 300) // 从1000ms改为300ms
}

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})

onMounted(() => {
  // 减少弹窗弹出延迟
  setTimeout(() => {
    showResumeModal.value = true
  }, 200) // 从300ms改为200ms
})
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.digital-human-interview {
  background: $bg-body;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .main-content {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 20px 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    width: 100%;
    
    // 顶部信息栏
    .top-bar {
      background: white;
      border-radius: 12px;
      padding: 16px 24px;
      margin-bottom: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      
      .left-section {
        display: flex;
        align-items: center;
        gap: 30px;
        
        .job-info {
          .label {
            color: $text-secondary;
            font-size: 14px;
          }
          .value {
            color: $primary;
            font-size: 16px;
            font-weight: 600;
            margin-left: 4px;
          }
        }
        
        .timer {
          padding: 6px 16px;
          border-radius: 30px;
          display: flex;
          align-items: center;
          
          i {
            color: $primary;
            margin-right: 8px;
            font-size: 14px;
          }
          
          .time {
            color: $text-primary;
            font-size: 16px;
            font-weight: 600;
            font-family: monospace;
          }
        }
      }
      
      .action-buttons {
        display: flex;
        gap: 12px;
        
        button {
          padding: 8px 24px;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.3s;
          border: none;
          
          i {
            font-size: 14px;
          }
          
          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        }
        
        .add-questions-btn {
          background: transparent;
          border: 2px solid $primary;
          color: $primary;
          
          &:hover:not(:disabled) {
            background: rgba($primary, 0.1);
          }
        }
        
        .start-btn {
          background: $primary;
          color: white;
          
          &:hover {
            background: $primary-dark;
          }
        }
        
        .end-btn {
          background: $danger;
          color: white;
          
          &:hover {
            background: darken($danger, 10%);
          }
        }
      }
    }
    
    // 视频区域
    .video-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      
      .video-container {
        background: #2A2A2A;
        border-radius: 16px;
        overflow: hidden;
        aspect-ratio: 16/9;
        position: relative;
        
        .video-label {
          position: absolute;
          top: 16px;
          left: 16px;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 13px;
          z-index: 10;
          backdrop-filter: blur(4px);
        }
        
        .video-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, #2A2A2A 0%, #1A1A1A 100%);
          color: white;
          position: relative;
          
          .avatar-icon {
            font-size: 48px;
            margin-bottom: 16px;
            opacity: 0.7;
          }
          
          p {
            font-size: 16px;
            opacity: 0.8;
            margin-bottom: 8px;
          }
          
          .status-tag {
            background: rgba(255, 255, 255, 0.15);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            transition: all 0.3s;
            
            &.active {
              background: rgba($primary, 0.3);
              color: lighten($primary, 20%);
            }
          }
        }
        
        &.right .video-placeholder {
          background: linear-gradient(145deg, #1A3A4A 0%, #0A2A3A 100%);
        }
      }
    }
  }
}

// 弹窗样式
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  
  .modal-container {
    background: white;
    width: 90%;
    max-width: 500px;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    
    .modal-step {
      text-align: center;
      
      .modal-title {
        color: $text-primary;
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 30px;
      }
      
      .upload-area {
        border: 2px dashed $border-color;
        border-radius: 12px;
        padding: 40px 20px;
        margin-bottom: 20px;
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover {
          border-color: $primary;
          background: rgba($primary, 0.05);
        }
        
        &.drag-over {
          border-color: $primary;
          background: rgba($primary, 0.1);
        }
        
        .upload-icon {
          font-size: 48px;
          color: $primary;
          margin-bottom: 16px;
        }
        
        .upload-text {
          color: $text-primary;
          font-size: 16px;
          margin-bottom: 8px;
        }
        
        .upload-hint {
          color: $text-secondary;
          font-size: 13px;
        }
        
        .file-input {
          display: none;
        }
        
        .select-file-btn {
          margin-top: 20px;
          padding: 8px 24px;
          background: $primary;
          border: none;
          border-radius: 30px;
          color: white;
          font-size: 14px;
          cursor: pointer;
          
          &:hover {
            background: $primary-dark;
          }
        }
      }
      
      .progress-bar {
        height: 6px;
        background: $bg-gray;
        border-radius: 3px;
        overflow: hidden;
        margin: 20px 0;
        position: relative;
        
        .progress-fill {
          height: 100%;
          background: $primary;
          transition: width 0.3s;
        }
        
        .progress-text {
          position: absolute;
          right: 0;
          top: -20px;
          font-size: 12px;
          color: $text-secondary;
        }
      }
      
      .error-message {
        color: $danger;
        font-size: 14px;
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }
      
      // 跳过按钮样式
      .skip-section {
        margin-top: 20px;
        text-align: center;
        
        .skip-btn {
          background: transparent;
          border: 1px solid $border-color;
          color: $text-regular;
          padding: 8px 24px;
          border-radius: 30px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
          
          &:hover {
            border-color: $primary;
            color: $primary;
          }
        }
      }
    }
    
    .ready-step {
      .success-icon {
        font-size: 64px;
        color: $success;
        margin-bottom: 20px;
        
        i {
          animation: scaleIn 0.5s;
        }
      }
      
      .file-info {
        color: $text-regular;
        font-size: 15px;
        margin: 20px 0;
        padding: 12px;
        background: $bg-gray;
        border-radius: 8px;
      }
      
      .start-btn-large {
        width: 100%;
        padding: 14px;
        background: $primary;
        border: none;
        border-radius: 30px;
        color: white;
        font-size: 18px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover {
          background: $primary-dark;
          transform: translateY(-2px);
        }
      }
    }
  }
}

// 动画
@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
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

// 手机适配
@media (max-width: 768px) {
  .digital-human-interview {
    .container {
      .top-bar {
        flex-direction: column;
        gap: 15px;
        
        .left-section {
          width: 100%;
          justify-content: space-between;
        }
        
        .action-buttons {
          width: 100%;
          flex-wrap: wrap;
          justify-content: center;
          
          button {
            flex: 1;
            justify-content: center;
          }
        }
      }
      
      .video-section {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }
  }
  
  .modal-container {
    padding: 30px 20px;
  }
}
</style>