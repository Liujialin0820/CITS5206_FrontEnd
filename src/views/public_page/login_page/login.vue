<template>
  <div class="page">
    <div class="container">
      <!-- 左：表单卡片 -->
      <el-card shadow="never" class="form-card">
        <h1 class="title">Student Profile</h1>

        <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="form">
          <el-form-item prop="examName">
            <template #label>
              <span>Exam Name <span class="req">*</span></span>
            </template>
            <el-input v-model="form.examName" placeholder="Enter exam name" />
          </el-form-item>

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
            <el-button type="primary" size="large" class="start-btn" @click="onSubmit">
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
          current language level.
        </p>
        <p class="mt">Time Limit: <strong>45 minutes</strong></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { get_test_paper_id_by_name, get_exam_api } from "@/apis/test_paper_api";

const router = useRouter();
const formRef = ref(null);

const form = reactive({
  examName: "",
  name: "",
  studentNo: "",
  email: "",
});

const rules = {
  examName: [{ required: true, message: "Exam name is required", trigger: "blur" }],
  name: [{ required: true, message: "Student name is required", trigger: "blur" }],
  studentNo: [{ required: true, message: "Student number is required", trigger: "blur" }],
  email: [
    { required: true, message: "Email is required", trigger: "blur" },
    { type: "email", message: "Please enter a valid email", trigger: ["blur", "change"] },
  ],
};

const onSubmit = () => {
  formRef.value?.validate(async (ok) => {
    if (!ok) return;

    try {
      // 1. 根据考试名称查找试卷 id
      const id = await get_test_paper_id_by_name(form.examName);
      if (!id) {
        ElMessage.error("No test paper found with that name.");
        return;
      }

      // 2. 调用 generate 获取题目
      const paper = await get_exam_api(id);

      // 3. 记录考试开始时间（毫秒时间戳）
      const startedAt = Date.now(); // 或 new Date().toISOString()

      // 4. 保存到 localStorage
      localStorage.setItem(
        "exam_session",
        JSON.stringify({
          student: { ...form },
          paper,
          startedAt,          // ✅ 保存考试开始时间
          duration: 45 * 60,  // ✅ 考试时长（秒），45分钟
        })
      );

      ElMessage.success("Exam loaded. Starting...");
      router.push("/exam");
    } catch (err) {
      console.error("❌ Failed:", err);
      ElMessage.error("Start failed");
    }
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
