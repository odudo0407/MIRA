<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import HotRecommend from './components/HotRecommend.vue'
import ContactSection from './components/ContactSection.vue'
import FooterSection from './components/FooterSection.vue'
import BackToTop from './components/BackToTop.vue'

const router = useRouter()
// 移动端菜单状态
const mobileMenuOpen = ref(false)

const heroTitle = ref('MIRA')
const heroSubtitle = ref('你的AI面试官，让面试更简单')
const contactTitle = ref('联系我们')
const contactSubtitle = ref('给我们留言')

const handleSubmit = (formData) => {
  console.log('表单提交:', formData)
}
</script>

<template>
  <div class="home">
    <NavBar :mobile-menu-open="mobileMenuOpen" @toggle-menu="mobileMenuOpen = !mobileMenuOpen" />
    <div class="home-content">
      <HeroSection :title="heroTitle" :subtitle="heroSubtitle" />
      
      <!-- 替换原来的 FeaturesSection 和 AboutSection -->
      <HotRecommend />
      
      <ContactSection 
        :contact-title="contactTitle"
        :contact-subtitle="contactSubtitle"
        @submit-form="handleSubmit"
      />
    </div>
    <FooterSection />
    
    <!-- 回到顶部按钮 -->
    <BackToTop />
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/home.scss';

.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
  .home-content {
    flex: 1;
  }
}
</style>