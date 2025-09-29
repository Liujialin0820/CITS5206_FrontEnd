<template>
  <div class="create-question">
    <el-button type="text" @click="goBack">← back</el-button>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      class="form-box"
    >
      <!-- Name -->
      <el-form-item label="Question Name" prop="name">
        <el-input
          v-model="form.name"
          placeholder="Please input question name"
        />
      </el-form-item>

      <!-- Four columns -->
      <el-row :gutter="16">
        <!-- Type -->
        <el-col :lg="6" :md="12" :sm="24">
          <el-form-item label="Question Type" prop="type">
            <el-select v-model="form.type" placeholder="Select type" clearable>
              <el-option label="Multiple Choice" value="Multiple Choice" />
              <el-option label="Single Choice" value="Single Choice" />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- Level -->
        <el-col :lg="6" :md="12" :sm="24">
          <el-form-item label="Level" prop="level">
            <el-select
              v-model="form.level"
              placeholder="Select level"
              clearable
            >
              <el-option label="Level 1" value="Level 1" />
              <el-option label="Level 2" value="Level 2" />
              <el-option label="Level 3" value="Level 3" />
              <el-option label="Level 4" value="Level 4" />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- Category -->
        <el-col :lg="6" :md="12" :sm="24">
          <el-form-item label="Category" prop="category">
            <el-select
              v-model="form.category"
              placeholder="Select category"
              clearable
            >
              <el-option label="Vocabulary" value="Vocabulary" />
              <el-option label="Grammar" value="Grammar" />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- Marks -->
        <el-col :lg="6" :md="12" :sm="24">
          <el-form-item label="Marks" prop="marks">
            <el-input-number
              v-model="form.marks"
              :min="1"
              :max="100"
              :controls="false"
              style="width: 100%"
              placeholder="Enter marks"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- Question text -->
      <el-form-item label="Question" prop="question">
        <el-input
          type="textarea"
          :rows="4"
          v-model="form.question"
          placeholder="Please input question detail"
        />
      </el-form-item>

      <!-- Image Upload -->
      <el-form-item label="Image">
        <el-upload
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          :multiple="true"
          :file-list="fileList"
          :on-change="handleImageChange"
          :on-remove="handleImageRemove"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <!-- Choices -->
      <el-form-item label="Choices">
        <div
          v-for="(choice, index) in form.choices"
          :key="index"
          class="choice-row"
        >
          <div class="choice-label">Item {{ labelOf(index) }}</div>
          <el-input
            v-model="choice.text"
            :placeholder="`Choice ${labelOf(index)}`"
          />
          <el-button
            :icon="DeleteIcon"
            circle
            text
            type="danger"
            @click="removeChoice(index)"
            :disabled="form.choices.length === 1"
          />
        </div>
        <el-button type="success" plain :icon="Plus" @click="addChoice"
          >Add Choice</el-button
        >
      </el-form-item>

      <!-- Correct Answer -->
      <el-form-item label="Correct Answer" prop="correctIndex">
        <el-select
          v-model="form.correctIndex"
          placeholder="Select correct answer(s)"
          clearable
          :multiple="form.type === 'Multiple Choice'"
        >
          <el-option
            v-for="(choice, i) in form.choices"
            :key="i"
            :label="`Item ${labelOf(i)}`"
            :value="i"
          />
        </el-select>
      </el-form-item>

      <!-- Actions -->
      <div class="actions">
        <el-button type="primary" size="large" @click="submitForm"
          >Save</el-button
        >
        <el-button size="large" @click="resetForm">Cancel</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Plus, Delete as DeleteIcon } from "@element-plus/icons-vue";
import { create_question_api } from "@/apis/admin_api";

const router = useRouter();
const formRef = ref(null);

const form = ref({
  name: "Sample Question",              // 默认值
  type: "Multiple Choice",              // 默认值
  level: "Level 1",                     // 默认值
  category: "Vocabulary",               // 默认值
  marks: 10,                            // 默认值
  question: "What is the default sample question?", // 默认值
  images: [],                           // 默认空数组
  choices: [
    { text: "Option A" },
    { text: "Option B" },
    { text: "Option C" },
    { text: "Option D" },
  ],                                    // 默认四个选项
  correctIndex: [0],                    // 默认第一个正确
});
const fileList = ref([]);

// rules
const rules = {
  name: [
    { required: true, message: "Please input question name", trigger: "blur" },
  ],
  type: [{ required: true, message: "Please select type", trigger: "change" }],
  level: [
    { required: true, message: "Please select level", trigger: "change" },
  ],
  category: [
    { required: true, message: "Please select category", trigger: "change" },
  ],
  marks: [{ required: true, message: "Please enter marks", trigger: "blur" }],
  question: [
    { required: true, message: "Please input question", trigger: "blur" },
  ],
  correctIndex: [
    {
      required: true,
      message: "Please select correct answer(s)",
      trigger: "change",
    },
  ],
};

// helpers
const labelOf = (i) => String.fromCharCode(65 + i);

function addChoice() {
  form.value.choices.push({ text: `Option ${labelOf(form.value.choices.length)}` });
}
function removeChoice(index) {
  if (form.value.choices.length === 1) return;
  form.value.choices.splice(index, 1);
  form.value.correctIndex = form.value.correctIndex.filter(
    (ci) => ci !== index
  );
}

// 上传新图
function handleImageChange(file, fileListArr) {
  form.value.images = fileListArr.map((f) => f.raw);
  fileList.value = fileListArr;
}
function handleImageRemove(file, fileListArr) {
  form.value.images = fileListArr.map((f) => f.raw);
  fileList.value = fileListArr;
}

// 提交
function submitForm() {
  formRef.value.validate(async (valid) => {
    if (!valid) return;

    const choices = form.value.choices.map((c, i) => ({
      text: c.text,
      is_correct: Array.isArray(form.value.correctIndex)
        ? form.value.correctIndex.includes(i)
        : form.value.correctIndex === i,
    }));

    const payload = {
      name: form.value.name,
      type: form.value.type,
      level: form.value.level,
      category: form.value.category,
      marks: form.value.marks,
      question_text: form.value.question,
      choices,
      images: form.value.images,
    };

    try {
      console.log("Payload:", payload);
      await create_question_api(payload);
      ElMessage.success("Created successfully");
      router.push("/admin-home/question-bank");
    } catch (err) {
      console.error("❌ Save failed:", err);
      ElMessage.error("Save failed");
    }
  });
}

// 重置（恢复默认值）
function resetForm() {
  form.value = {
    name: "Sample Question",
    type: "Multiple Choice",
    level: "Level 1",
    category: "Vocabulary",
    marks: 10,
    question: "What is the default sample question?",
    images: [],
    choices: [
      { text: "Option A" },
      { text: "Option B" },
      { text: "Option C" },
      { text: "Option D" },
    ],
    correctIndex: [0],
  };
  fileList.value = [];
}

function goBack() {
  router.push("/admin-home/question-bank");
}
</script>


<style scoped>
.create-question {
  padding: 24px;
  max-width: 960px;
}
.form-box {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}
.choice-row {
  display: grid;
  grid-template-columns: 100px 1fr 40px;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.choice-label {
  color: #666;
}
.actions {
  margin-top: 20px;
  display: flex;
  gap: 12px;
}
</style>
