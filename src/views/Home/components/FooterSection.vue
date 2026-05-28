<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-logo">
        <img src="@/assets/images/footer-logo.png" alt="MIRA" class="footer-logo-img">
      </div>
      
      <!-- 把版权文字 + 备案链接 包在同一个块里 -->
      <div class="footer-info">
        <div class="footer-copyright">© 2026 MIRA. 用每一次AI对话，兑换一张真实Offer。</div>
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" class="footer-beian">
          蜀ICP备2026020279号
        </a>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@import '@/styles/home.scss';

/* 关键：让容器铺满宽度 + 文字绝对水平居中 */
.footer-container {
  position: relative;
  display: flex;
  align-items: center;
}

.footer-logo {
  .footer-logo-img {
    height: 60px;      
    width: auto;
    object-fit: contain;
    margin-left: 80px;
  }
}

/* 核心：让文字组 水平居中 整个footer */
.footer-info {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #fff;
}

.footer-beian {
  color: #ccc;
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    color: #fff;
  }
}
</style>