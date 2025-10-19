<template>
  <footer class="site-footer">
    <div class="footer-content">
      <!-- 四列布局 -->
      <div class="footer-columns">
        <!-- 第一列：诗韵赏析 -->
        <div class="footer-column">
          <h3 class="footer-title">诗韵赏析</h3>
          <p class="footer-description">
            传承中华文化，品读诗词之美。我们致力于为诗词爱好者提供一个高品质的欣赏与交流平台。
          </p>
        </div>

        <!-- 第二列：快速链接 -->
        <div class="footer-column">
          <h3 class="footer-title">快速链接</h3>
          <ul class="footer-links">
            <li><RouterLink to="/about">关于我们</RouterLink></li>
            <li><RouterLink to="/community">社区交流</RouterLink></li>
            <li><RouterLink to="/collections">我的收藏</RouterLink></li>
            <li><RouterLink to="/search">诗词搜索</RouterLink></li>
          </ul>
        </div>

        <!-- 第三列：友情链接 -->
        <div class="footer-column">
          <h3 class="footer-title">友情链接</h3>
          <ul class="footer-links">
            <li><a href="https://www.shi-ci.com" target="_blank" rel="noreferrer">中国诗歌网</a></li>
            <li><a href="https://www.gushiwen.org" target="_blank" rel="noreferrer">古诗文网</a></li>
            <li><a href="https://www.shicimingju.com" target="_blank" rel="noreferrer">诗词名句网</a></li>
            <li><a href="https://www.zhscxh.com" target="_blank" rel="noreferrer">中华诗词学会</a></li>
          </ul>
        </div>

        <!-- 第四列：联系我们 -->
        <div class="footer-column">
          <h3 class="footer-title">联系我们</h3>
          <div class="contact-info">
            <p>北京市朝阳区诗词文化中心</p>
            <p>400-123-4567</p>
            <p>contact@shiyun.com</p>
          </div>
        </div>
      </div>

      <!-- 底部版权信息 -->
      <div class="footer-bottom">
        <div class="footer-divider"></div>
        <p class="copyright">© 2025 星汉诗词 · 让诗词文化在现代科技中焕发新的生命力</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts" name="SiteFooter"></script>

<style scoped>
.site-footer {
  background: #000000;
  color: #e2e8f0;
  padding: 48px 0 24px;
  margin-top: 80px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 48px;
  margin-bottom: 48px;
}

.footer-column {
  display: flex;
  flex-direction: column;
}

.footer-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
  letter-spacing: 0.025em;
}

.footer-description {
  color: #94a3b8;
  line-height: 1.6;
  font-size: 0.875rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: #ffffff;
  text-decoration: underline;
}

.contact-info p {
  color: #94a3b8;
  font-size: 0.875rem;
  margin-bottom: 8px;
  line-height: 1.5;
}

.footer-bottom {
  border-top: 1px solid #334155;
  padding-top: 24px;
}

.footer-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #475569 50%, transparent 100%);
  margin-bottom: 16px;
}

.copyright {
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-columns {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .site-footer {
    padding: 32px 0 16px;
  }

  .footer-content {
    padding: 0 16px;
  }
}

@media (max-width: 480px) {
  .footer-columns {
    gap: 24px;
  }

  .footer-title {
    font-size: 1rem;
  }

  .footer-description,
  .footer-links a,
  .contact-info p {
    font-size: 0.8125rem;
  }
}
</style>

