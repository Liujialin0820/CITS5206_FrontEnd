<!-- StudentLanding.vue -->
<template>
  <div class="lp-wrap">
    <!-- 深蓝装饰块 -->
    <div class="decor"></div>

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

    <!-- 右侧插画卡片 -->
    <section class="art-card el-card">
      <img :src="imgSrc" alt="illustration" class="art" draggable="false" />
    </section>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
const router = useRouter();
import imgSrc from '@/assets/image/home.png'   // ← 这样导入


const onNext = () => {
  // TODO: 跳到你的下一步路由，比如 /profile
  router.push('/login')
  ElMessage.success("Next →");
};
</script>

<style scoped>
/* 页面底色 + 居中布局 */
.lp-wrap {
  min-height: 100vh;
  background: #f1f3f6; /* 接近截图浅灰 */
  display: grid;
  place-items: center;
  padding: 64px 16px;
  position: relative;
}

/* 网格排版：左主卡片 + 右插画卡片 */
.lp-wrap {
  grid-template-columns: minmax(300px, 720px) 340px;
  gap: 36px;
}

/* 深蓝装饰块（位于主卡片左上后方） */
.decor {
  width: 300px;
  height: 140px;
  background: #243084; /* 深蓝 */
  position: absolute;
  left: clamp(60px, 10vw, 240px);
  top: clamp(90px, 12vh, 180px);
  z-index: 0;
  border-radius: 2px;
}

/* 主卡片（淡蓝） */
.hero-card {
  z-index: 1;
  background: #4f95c7; /* 与上一页一致的蓝 */
  color: #fff;
  border: none;
  padding: 28px 36px 32px;
  border-radius: 2px;
  box-shadow: none;
}

/* 标题 */
.title {
  font-size: 42px;
  line-height: 1.25;
  font-weight: 600;
  margin: 6px 0 16px;
  letter-spacing: 0.2px;
  color: #fff;
}

/* 正文 */
.p {
  margin: 10px 0;
  line-height: 1.55;
  font-size: 16px;
  color: #eef6ff;
  text-indent: 10px; /* 截图里有一点缩进感 */
}

/* 按钮行与样式 */
.btn-row {
  margin-top: 22px;
}
.next-btn {
  width: 160px;
  height: 44px;
  font-weight: 600;
  border-radius: 6px;
  --el-color-primary: #2b3d99; /* 深蓝按钮色，贴近截图 */
}

/* 右侧插画白卡片 */
.art-card {
  z-index: 1;
  width: 340px;
  height: 260px;
  background: #fff;
  border: none;
  box-shadow: none;
  padding: 0;
  display: grid;
  place-items: center;
}
.art {
  max-width: 88%;
  max-height: 88%;
  object-fit: contain;
  user-select: none;
}

/* 响应式：窄屏改为上下布局 */
@media (max-width: 980px) {
  .lp-wrap {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .decor {
    left: 24px;
    top: 48px;
    width: 220px;
    height: 110px;
  }
  .art-card {
    justify-self: center;
  }
  .title {
    font-size: 34px;
  }
}
</style>
