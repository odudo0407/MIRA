<template>
  <div class="login-container">
    <NavBar />
    
    <div class="container">
      <div class="auth-card">
        <!-- 标题和切换 -->
        <div class="auth-header">
          <h2>{{ isLogin ? '登录' : '注册' }}</h2>
          <p>
            {{ isLogin ? '没有账号？' : '已有账号？' }}
            <a href="javascript:;" @click="toggleMode">
              {{ isLogin ? '立即注册' : '立即登录' }}
            </a>
          </p>
        </div>

        <!-- 登录表单 -->
        <form v-if="isLogin" @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label>邮箱</label>
            <div class="input-wrapper">
              <i class="fas fa-envelope"></i>
              <input 
                type="email" 
                v-model="loginForm.email" 
                placeholder="请输入邮箱"
                required
              >
            </div>
          </div>

          <div class="form-group">
            <label>密码</label>
            <div class="input-wrapper">
              <i class="fas fa-lock"></i>
              <input 
                :type="showPassword ? 'text' : 'password'" 
                v-model="loginForm.password" 
                placeholder="请输入密码"
                required
              >
              <i 
                class="fas" 
                :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
                @click="showPassword = !showPassword"
              ></i>
            </div>
          </div>

          <div class="form-options">
            <label class="remember">
              <input type="checkbox" v-model="rememberMe">
              <span class="checkbox-custom"></span>
              <span>记住我</span>
            </label>
            <a href="javascript:;" class="forgot-password">忘记密码？</a>
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="!loading">登录</span>
            <i v-else class="fas fa-spinner fa-spin"></i>
          </button>
        </form>

        <!-- 注册表单 -->
        <form v-else @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label>昵称</label>
            <div class="input-wrapper">
              <i class="fas fa-user"></i>
              <input 
                type="text" 
                v-model="registerForm.nickname" 
                placeholder="请输入昵称"
                required
              >
            </div>
          </div>

          <div class="form-group">
            <label>邮箱</label>
            <div class="input-wrapper">
              <i class="fas fa-envelope"></i>
              <input 
                type="email" 
                v-model="registerForm.email" 
                placeholder="请输入邮箱"
                required
              >
            </div>
          </div>

          <div class="form-group">
            <label>密码</label>
            <div class="input-wrapper">
              <i class="fas fa-lock"></i>
              <input 
                :type="showPassword ? 'text' : 'password'" 
                v-model="registerForm.password" 
                placeholder="请输入密码"
                required
              >
              <i 
                class="fas" 
                :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
                @click="showPassword = !showPassword"
              ></i>
            </div>
          </div>

          <div class="form-group">
            <label>确认密码</label>
            <div class="input-wrapper">
              <i class="fas fa-lock"></i>
              <input 
                :type="showConfirmPassword ? 'text' : 'password'" 
                v-model="registerForm.confirmPassword" 
                placeholder="请再次输入密码"
                required
              >
              <i 
                class="fas" 
                :class="showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'"
                @click="showConfirmPassword = !showConfirmPassword"
              ></i>
            </div>
          </div>

          <div class="form-group terms">
            <label class="checkbox">
              <input type="checkbox" v-model="agreeTerms">
              <span class="checkbox-custom"></span>
              <span>我已阅读并同意 <a href="javascript:;">《用户协议》</a> 和 <a href="javascript:;">《隐私政策》</a></span>
            </label>
          </div>

          <button type="submit" class="submit-btn" :disabled="loading || !agreeTerms">
            <span v-if="!loading">注册</span>
            <i v-else class="fas fa-spinner fa-spin"></i>
          </button>
        </form>

        <!-- 第三方登录 -->
        <div class="third-party">
          <p class="divider"><span>或使用以下方式登录</span></p>
          <div class="third-party-icons">
            <a href="javascript:;" class="icon-btn wechat">
              <i class="fab fa-weixin"></i>
            </a>
            <a href="javascript:;" class="icon-btn qq">
              <i class="fab fa-qq"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <FooterSection />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/views/Home/components/NavBar.vue'
import FooterSection from '@/views/Home/components/FooterSection.vue'
// 导入 updateUser
import { updateUser } from '@/shared/data.js'

const router = useRouter()

// 模式切换
const isLogin = ref(true)

// 加载状态
const loading = ref(false)

// 密码显示控制
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// 登录表单
const loginForm = reactive({
  email: '',
  password: ''
})
const rememberMe = ref(false)

// 注册表单
const registerForm = reactive({
  nickname: '',
  email: '',
  password: '',
  confirmPassword: ''
})
const agreeTerms = ref(false)

// 切换登录/注册
const toggleMode = () => {
  isLogin.value = !isLogin.value
  // 清空表单
  loginForm.email = ''
  loginForm.password = ''
  registerForm.nickname = ''
  registerForm.email = ''
  registerForm.password = ''
  registerForm.confirmPassword = ''
}

// 处理登录
const handleLogin = async () => {
  loading.value = true
  
  setTimeout(() => {
    const mockUser = {
      id: 1,
      name: '测试用户',
      email: loginForm.email,
      avatar: '/src/assets/images/user.png'
    }
    
    // 使用 updateUser 更新共享状态
    updateUser(mockUser)
    
    loading.value = false
    router.push('/')
  }, 1000)
}

// 处理注册
const handleRegister = async () => {
  if (registerForm.password !== registerForm.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }
  
  loading.value = true
  
  setTimeout(() => {
    const mockUser = {
      id: Date.now(),
      name: registerForm.nickname,
      email: registerForm.email,
      avatar: '/src/assets/images/user.png'
    }
    
    // 使用 updateUser 更新共享状态
    updateUser(mockUser)
    
    loading.value = false
    router.push('/')
  }, 1000)
}
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.login-container {
  background: $bg-body;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  width: $container-width;
  margin: 0 auto;
  padding: 40px 0;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-card {
  background: $white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
  padding: 40px;
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;

  h2 {
    font-size: 28px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 8px;
  }

  p {
    color: $text-regular;
    font-size: 14px;

    a {
      color: $primary;
      text-decoration: none;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.auth-form {
  .form-group {
    margin-bottom: 20px;

    label {
      display: block;
      margin-bottom: 8px;
      color: $text-regular;
      font-size: 14px;
      font-weight: 500;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;

      i {
        position: absolute;
        left: 12px;
        color: $text-placeholder;
        font-size: 16px;

        &:last-child {
          left: auto;
          right: 12px;
          cursor: pointer;
          transition: color 0.3s;

          &:hover {
            color: $primary;
          }
        }
      }

      input {
        width: 100%;
        padding: 12px 40px;
        border: 1px solid $border-color;
        border-radius: 8px;
        font-size: 14px;
        transition: all 0.3s;

        &:focus {
          outline: none;
          border-color: $primary;
          box-shadow: 0 0 0 3px rgba($primary, 0.1);
        }
      }
    }
  }

  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .remember {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      position: relative;

      input[type="checkbox"] {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
      }

      .checkbox-custom {
        width: 18px;
        height: 18px;
        border: 2px solid $border-color;
        border-radius: 4px;
        background: white;
        transition: all 0.2s;
        position: relative;
      }

      input[type="checkbox"]:checked + .checkbox-custom {
        background: $primary;
        border-color: $primary;
        
        &::after {
          content: '';
          position: absolute;
          left: 5px;
          top: 2px;
          width: 5px;
          height: 9px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
      }

      span:last-child {
        color: $text-regular;
        font-size: 13px;
      }
    }

    .forgot-password {
      color: $primary;
      font-size: 13px;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .form-group.terms {
    .checkbox {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      position: relative;

      input[type="checkbox"] {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
      }

      .checkbox-custom {
        width: 18px;
        height: 18px;
        border: 2px solid $border-color;
        border-radius: 4px;
        background: white;
        transition: all 0.2s;
        flex-shrink: 0;
      }

      input[type="checkbox"]:checked + .checkbox-custom {
        background: $primary;
        border-color: $primary;
        
        &::after {
          content: '';
          position: absolute;
          left: 5px;
          top: 2px;
          width: 5px;
          height: 9px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
      }

      span:last-child {
        color: $text-regular;
        font-size: 13px;
        
        a {
          color: $primary;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }

  .submit-btn {
    width: 100%;
    padding: 14px;
    background: $primary;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;

    &:hover:not(:disabled) {
      background: $primary-dark;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba($primary, 0.3);
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

.third-party {
  margin-top: 30px;

  .divider {
    position: relative;
    text-align: center;
    margin-bottom: 20px;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: $border-light;
      z-index: 1;
    }

    span {
      position: relative;
      z-index: 2;
      background: $white;
      padding: 0 15px;
      color: $text-secondary;
      font-size: 13px;
    }
  }

  .third-party-icons {
    display: flex;
    justify-content: center;
    gap: 20px;

    .icon-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      color: white;

      i {
        font-size: 20px;
      }

      &.wechat {
        background: #07c160;
        &:hover {
          background: darken(#07c160, 10%);
          transform: translateY(-3px);
        }
      }

      &.qq {
        background: #12b7f5;
        &:hover {
          background: darken(#12b7f5, 10%);
          transform: translateY(-3px);
        }
      }

      &.github {
        background: #24292e;
        &:hover {
          background: lighten(#24292e, 10%);
          transform: translateY(-3px);
        }
      }
    }
  }
}

// 手机适配
@media (max-width: 640px) {
  .auth-card {
    padding: 30px 20px;
  }

  .auth-header h2 {
    font-size: 24px;
  }
}
</style>