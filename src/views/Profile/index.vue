<template>
  <div class="profile">
    <NavBar />
    
    <div class="profile-container">
      <!-- 左侧边栏 -->
      <Sidebar />
      
      <!-- 右侧内容区域 -->
      <div class="profile-content">
        <router-view />
      </div>
    </div>
    
    <FooterSection />
  </div>
</template>

<script setup>
import NavBar from '@/views/Home/components/NavBar.vue'
import FooterSection from '@/views/Home/components/FooterSection.vue'
import Sidebar from './components/Sidebar.vue'
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.profile {
  background: $bg-body;
  min-height: 100vh;
}

.profile-container {
  width: $container-width;
  margin: 30px auto;
  display: flex;
  gap: 30px;
  min-height: calc(100vh - 200px);
}

.profile-content {
  flex: 1;
  background: $white;
  border-radius: 12px;
  border: 1px solid $border-light;
  padding: 30px;
}

// 手机适配
@media (max-width: 768px) {
  .profile-container {
    width: 100%;
    padding: 0 20px;
    flex-direction: column;
  }
}
</style>