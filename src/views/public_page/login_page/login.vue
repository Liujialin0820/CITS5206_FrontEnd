<!-- StudentProfile.vue -->
<template>
  <div class="page">
    <div class="container">
      <!-- 左：表单卡片 -->
      <el-card shadow="never" class="form-card">
        <h1 class="title">Student Profile</h1>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          class="form"
        >
          <el-form-item prop="name">
            <template #label>
              <span>Student Name <span class="req">*</span></span>
            </template>
            <el-input v-model="form.name" placeholder="Enter your full name" />
          </el-form-item>

          <el-form-item prop="studentNo">
            <template #label>
              <span>UWA Student Number <span class="req">*</span></span>
            </template>
            <el-input v-model="form.studentNo" placeholder="e.g. 12345678" />
          </el-form-item>

          <el-form-item prop="email">
            <template #label>
              <span>UWA Student E-mail <span class="req">*</span></span>
            </template>
            <el-input v-model="form.email" placeholder="name@uwa.edu.au" />
          </el-form-item>

          <div class="actions">
            <el-button
              type="primary"
              size="large"
              class="start-btn"
              @click="onSubmit"
            >
              Start Test
            </el-button>
          </div>
        </el-form>
      </el-card>

      <!-- 右：说明 -->
      <div class="instructions">
        <p class="heading">Exam Instructions:</p>
        <p>
          This is a Korean Language Placement Test designed to evaluate your
          current language level. The test includes multiple sections:
          Vocabulary, Grammar, Listening, and Reading.
        </p>

        <p class="mt">Time Limit: <strong>45 minutes</strong></p>

        <p class="mt">Please Note:</p>
        <ul class="list">
          <li>Make sure you have a stable internet connection.</li>
          <li>
            You can only take the test once, so please focus and do your best.
          </li>
          <li>Do not refresh or close the browser during the test.</li>
          <li>Your progress will not be saved if you leave the page.</li>
        </ul>

        <p class="mt">
          When you're ready, click <strong>Start Test</strong> to begin.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";

const formRef = ref(null);

const form = reactive({
  name: "",
  studentNo: "",
  email: "",
});

const rules = {
  name: [
    { required: true, message: "Student name is required", trigger: "blur" },
  ],
  studentNo: [
    { required: true, message: "Student number is required", trigger: "blur" },
  ],
  email: [
    { required: true, message: "Email is required", trigger: "blur" },
    {
      type: "email",
      message: "Please enter a valid email",
      trigger: ["blur", "change"],
    },
  ],
};

const onSubmit = () => {
  formRef.value?.validate((ok) => {
    if (!ok) return;
    // TODO: 调用后端 API /login 或你定义的报名接口
    ElMessage.success("Form validated. Starting the test...");
    // 例如：router.push('/exam')
  });
};
</script>

<style scoped>
.page {
  background: #f1f3f6; /* 与截图相近的浅灰背景 */
  min-height: 100vh;
  padding: 48px 16px;
  box-sizing: border-box;
  display: grid;
  place-items: start center;
}

.container {
  width: min(1080px, 100%);
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 28px;
  align-items: start;
}

.form-card {
  background: #4f95c7; /* 蓝色卡片 */
  border: none;
  color: #fff;
  padding: 28px;
}

.title {
  font-size: 40px;
  font-weight: 600;
  text-align: center;
  margin: 8px 0 24px;
  letter-spacing: 0.5px;
  color: #fff;
}

.form :deep(.el-form-item__label) {
  color: #eaf4ff;
  font-weight: 500;
}

.req {
  color: #ffdf80;
  margin-left: 2px;
}

.form :deep(.el-input__wrapper) {
  background: #fff;
  box-shadow: none;
  border: 2px solid #e6eef7;
  border-radius: 6px;
}

.form :deep(.el-input__inner) {
  color: #1c2b3a;
}

.actions {
  margin-top: 12px;
  display: flex;
  justify-content: center;
}

.start-btn {
  padding: 12px 28px;
  font-weight: 600;
  border-radius: 8px;
  /* 近似截图的深蓝按钮 */
  --el-color-primary: #2b3d99;
}

.instructions {
  padding: 12px 8px;
  color: #222f3e;
  line-height: 1.55;
  font-size: 15px;
}

.heading {
  font-weight: 600;
  margin-bottom: 8px;
}

.mt {
  margin-top: 16px;
}

.list {
  padding-left: 18px;
  margin: 8px 0 0;
}

@media (max-width: 900px) {
  .container {
    grid-template-columns: 1fr;
  }
  .instructions {
    background: transparent;
  }
}
</style>
