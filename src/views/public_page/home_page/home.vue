<!-- StudentLanding.vue -->
<template>
  <div class="lp-wrap">
    <!-- 深蓝装饰块 -->

    <!-- 内容容器 -->
    <div class="content">
      <!-- 主卡片 -->
      <section class="hero-card el-card">
        <h1 class="title">Korean Placement Test - General</h1>

        <p class="p">
          Welcome to the Korean Language Test Platform! Here you can take
          level-based quizzes to assess your vocabulary, grammar, listening, and
          more. Your results will help us place you in the right learning path.
        </p>

        <p class="p">Take your time, and do your best!</p>

        <div class="btn-row">
          <el-button type="primary" size="large" class="next-btn" @click="onNext">
            Next
          </el-button>
        </div>
      </section>

      <!-- 插画卡片 -->
      <section class="art-card el-card">
        <img :src="imgSrc" alt="illustration" class="art" draggable="false" />
      </section>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import imgSrc from "@/assets/image/home.png";

const router = useRouter();

const onNext = () => {
  router.push("/login");
  ElMessage.success("Next →");
};
</script>

<style scoped>
/* 整体居中 */
.lp-wrap {
  min-height: 90vh;
  background: #f1f3f6;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
}

/* 内容横向排列 */
.content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  max-width: 1100px;
  width: 100%;
  position: relative;
  z-index: 1;
}

/* 装饰块 */
.decor {
  width: 340px;
  height: 160px;
  background: linear-gradient(135deg, #2b3d99, #243084);
  position: absolute;
  left: 60px;
  top: 80px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
  z-index: 0;
}

/* 主卡片 */
.hero-card {
  flex: 1;
  background: linear-gradient(135deg, #4f95c7, #2b3d99);
  color: #fff;
  border: none;
  padding: 36px 40px;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* 标题 */
.title {
  font-size: 42px;
  line-height: 1.25;
  font-weight: 700;
  margin: 8px 0 20px;
  color: #fff;
}

/* 正文 */
.p {
  margin: 12px 0;
  line-height: 1.6;
  font-size: 16px;
  color: #eef6ff;
  text-indent: 10px;
}

/* 按钮 */
.btn-row {
  margin-top: 28px;
}
.next-btn {
  width: 180px;
  height: 48px;
  font-weight: 600;
  border-radius: 8px;
  background: #fff !important;
  color: #2b3d99 !important;
  border: none;
  box-shadow: 0 4px 10px rgba(43, 61, 153, 0.3);
}
.next-btn:hover {
  background: #eef2ff !important;
  color: #1d2a6b !important;
}

/* 插画卡片 */
.art-card {
  width: 360px;
  height: 280px;
  background: #fff;
  border: none;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  display: grid;
  place-items: center;
}
.art {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  user-select: none;
}

/* 响应式：小屏幕上下排 */
@media (max-width: 980px) {
  .content {
    flex-direction: column;
    gap: 28px;
  }
  .decor {
    left: 24px;
    top: 60px;
    width: 240px;
    height: 120px;
  }
  .title {
    font-size: 34px;
  }
}
</style>
