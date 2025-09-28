<template>
  <div class="edit-question">
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
    :limit="1"
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
          >Update</el-button
        >
        <el-button size="large" @click="goBack">Cancel</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Plus, Delete as DeleteIcon } from "@element-plus/icons-vue";
import { get_question_detail_api, update_question_api } from "@/apis/admin_api";

const router = useRouter();
const route = useRoute();
const formRef = ref(null);
const questionId = route.params.id;

const form = ref({
  name: "",
  type: "",
  level: "",
  category: "",
  marks: null,
  question: "",
  image: null, // ✅ 单文件
  choices: [{ text: "" }],
  correctIndex: [],
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
  form.value.choices.push({ text: "" });
}
function removeChoice(index) {
  if (form.value.choices.length === 1) return;
  form.value.choices.splice(index, 1);
  form.value.correctIndex = form.value.correctIndex.filter(
    (ci) => ci !== index
  );
}
// 上传新图
function handleImageChange(file) {
  form.value.image = file.raw;
  fileList.value = [file]; // 只保留一张
}

// 移除
function handleImageRemove() {
  form.value.image = null;
  fileList.value = [];
}
// 加载已有数据
async function loadQuestion() {
  const data = await get_question_detail_api(questionId);

  form.value = {
    name: data.name,
    type: data.type,
    level: data.level,
    category: data.category,
    marks: data.marks,
    question: data.question_text,
    image: null, // ✅ 只有用户上传新图时才赋值
    choices: data.choices || [{ text: "" }],
    correctIndex: data.choices
      .map((c, i) => (c.is_correct ? i : null))
      .filter((x) => x !== null),
  };

  // 显示原图
  if (data.image) {
    fileList.value = [
      { name: "current.jpg", url: data.image.image },
    ];
  }
}
// submit update
function submitForm() {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      await update_question_api(questionId, form.value);
      ElMessage.success("Updated successfully");
      router.push("/admin-home/question-bank");
    } catch (err) {
      console.error("❌ Update failed:", err);
      ElMessage.error("Update failed");
    }
  });
}

function goBack() {
  router.push("/admin-home/question-bank");
}

onMounted(() => {
  loadQuestion();
});
</script>

<style scoped>
.edit-question {
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
