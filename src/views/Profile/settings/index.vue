<template>
  <div class="profile-settings">
    <div class="page-header">
      <h2>账户设置</h2>
    </div>

    <!-- 头像设置 -->
    <div class="settings-section">
      <h3>头像</h3>
      <div class="avatar-section">
        <img :src="userAvatar" alt="" class="avatar">
        <button class="upload-btn" @click="triggerFileUpload">
          <i class="fas fa-camera"></i> 上传新头像
        </button>
        <input 
          type="file" 
          ref="fileInput"
          style="display: none"
          accept="image/*"
          @change="handleAvatarUpload"
        >
      </div>
    </div>

    <!-- 基本信息 -->
    <div class="settings-section">
      <h3>基本信息</h3>
      
      <div class="form-item">
        <label>昵称</label>
        <div class="form-control">
          <input type="text" v-model="form.nickname" placeholder="请输入昵称">
          <button class="save-btn" @click="saveNickname">保存</button>
        </div>
      </div>

      <div class="form-item">
        <label>邮箱</label>
        <div class="form-control readonly">
          <input type="email" :value="userInfo?.email" readonly disabled>
          <span class="badge verified">已绑定</span>
        </div>
      </div>
    </div>

    <!-- 修改密码 -->
    <div class="settings-section">
      <h3>修改密码</h3>
      
      <div class="form-item">
        <label>当前密码</label>
        <input type="password" v-model="passwordForm.current" placeholder="请输入当前密码">
      </div>

      <div class="form-item">
        <label>新密码</label>
        <input type="password" v-model="passwordForm.new" placeholder="请输入新密码">
      </div>

      <div class="form-item password-with-button">
        <div class="password-input-wrapper">
          <label>确认新密码</label>
          <input type="password" v-model="passwordForm.confirm" placeholder="请再次输入新密码">
        </div>
        <button class="submit-btn password-submit" @click="changePassword">修改密码</button>
      </div>
    </div>

    <!-- 危险操作 -->
    <div class="settings-section danger">
      <h3>危险操作</h3>
      
      <div class="danger-item">
        <div class="info">
          <h4>注销账号</h4>
          <p>注销后，您的所有数据将被永久删除，且无法恢复</p>
        </div>
        <button class="danger-btn" @click="confirmDelete">注销账号</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { currentUser } from '@/shared/data.js'

const router = useRouter()
const fileInput = ref(null)

// 用户信息
const userInfo = computed(() => currentUser.value)
const userAvatar = computed(() => userInfo.value?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg')

// 表单
const form = ref({
  nickname: userInfo.value?.name || ''
})

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

// 触发文件上传
const triggerFileUpload = () => {
  fileInput.value.click()
}

// 处理头像上传
const handleAvatarUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return

  // 模拟上传（纯前端）
  const reader = new FileReader()
  reader.onload = (e) => {
    // 更新 localStorage 中的用户信息
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      user.avatar = e.target.result
      localStorage.setItem('user', JSON.stringify(user))
      currentUser.value = user
    }
    alert('头像上传成功（模拟）')
  }
  reader.readAsDataURL(file)
}

// 保存昵称
const saveNickname = () => {
  if (!form.value.nickname.trim()) return

  // 更新 localStorage
  const userStr = localStorage.getItem('user')
  if (userStr) {
    const user = JSON.parse(userStr)
    user.name = form.value.nickname
    localStorage.setItem('user', JSON.stringify(user))
    currentUser.value = user
    alert('昵称修改成功')
  }
}

// 修改密码
const changePassword = () => {
  if (!passwordForm.value.current || !passwordForm.value.new || !passwordForm.value.confirm) {
    alert('请填写所有密码字段')
    return
  }

  if (passwordForm.value.new !== passwordForm.value.confirm) {
    alert('两次输入的新密码不一致')
    return
  }

  // 模拟修改密码
  alert('密码修改成功（模拟）')
  passwordForm.value.current = ''
  passwordForm.value.new = ''
  passwordForm.value.confirm = ''
}

// 确认注销
const confirmDelete = () => {
  if (confirm('确定要注销账号吗？此操作不可逆！')) {
    localStorage.removeItem('user')
    currentUser.value = null
    router.push('/')
    alert('账号已注销')
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.profile-settings {
  .page-header {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid $border-light;

    h2 {
      color: $text-primary;
      font-size: 20px;
      font-weight: 600;
    }
  }

  .settings-section {
    margin-bottom: 32px;
    padding-bottom: 32px;
    border-bottom: 1px solid $border-light;

    &:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    h3 {
      color: $text-primary;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    &.danger {
      h3 {
        color: $danger;
      }
    }
  }

  .avatar-section {
    display: flex;
    align-items: center;
    gap: 24px;

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
    }

    .upload-btn {
      padding: 8px 16px;
      background: transparent;
      border: 1px solid $border-color;
      border-radius: 6px;
      color: $text-regular;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;

      i {
        font-size: 14px;
      }

      &:hover {
        border-color: $primary;
        color: $primary;
      }
    }
  }

  .form-item {
    margin-bottom: 20px;

    label {
      display: block;
      color: $text-regular;
      font-size: 14px;
      margin-bottom: 6px;
    }

    input {
      width: 100%;
      max-width: 400px;
      padding: 10px 12px;
      border: 1px solid $border-color;
      border-radius: 6px;
      font-size: 14px;

      &:focus {
        outline: none;
        border-color: $primary;
      }

      &:disabled {
        background: $bg-gray;
        cursor: not-allowed;
      }
    }

    .form-control {
      display: flex;
      gap: 12px;
      align-items: center;

      input {
        flex: 1;
        max-width: 400px;
      }

      &.readonly {
        input {
          background: $bg-gray;
        }
      }

      .save-btn {
        padding: 10px 20px;
        background: $primary;
        border: none;
        border-radius: 6px;
        color: white;
        font-size: 14px;
        cursor: pointer;

        &:hover {
          background: $primary-dark;
        }
      }

      .badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;

        &.verified {
          background: rgba($success, 0.1);
          color: $success;
        }
      }
    }
  }

  // 修改密码区域的新样式
  .password-with-button {
    display: flex;
    align-items: flex-end;
    gap: 0px;
    
    .password-input-wrapper {
      flex: 1;
      
      input {
        width: 100%;
        max-width: 400px;
      }
    }
    
    .password-submit {
      margin-bottom: 0;  // 移除可能的底部边距
      height: 42px;      // 与输入框高度保持一致
      white-space: nowrap;
      padding: 0 24px;
	  transform: translateX(-270px); // 添加这行，向左移动10像素
    }
  }

  .submit-btn {
    padding: 10px 24px;
    background: $primary;
    border: none;
    border-radius: 6px;
    color: white;
    font-size: 14px;
    cursor: pointer;

    &:hover {
      background: $primary-dark;
    }
  }

  .danger-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: rgba($danger, 0.05);
    border-radius: 8px;

    .info {
      h4 {
        color: $danger;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 4px;
      }

      p {
        color: $text-secondary;
        font-size: 13px;
      }
    }

    .danger-btn {
      padding: 8px 16px;
      background: transparent;
      border: 1px solid $danger;
      border-radius: 6px;
      color: $danger;
      font-size: 13px;
      cursor: pointer;

      &:hover {
        background: $danger;
        color: white;
      }
    }
  }
}

// 手机适配
@media (max-width: 768px) {
  .profile-settings {
    .password-with-button {
      flex-direction: column;
      align-items: stretch;
      
      .password-submit {
        width: 100%;
      }
    }
  }
}
</style>