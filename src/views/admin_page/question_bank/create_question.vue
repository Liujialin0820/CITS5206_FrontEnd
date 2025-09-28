<template>
  <div class="create-question">
    <!-- back button -->
    <el-button type="text" @click="goBack">← back</el-button>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      class="form-box"
    >
      <!-- Question Name -->
      <el-form-item label="Question Name" prop="name">
        <el-input
          v-model="form.name"
          placeholder="Please input question name"
        />
      </el-form-item>

      <!-- Four columns -->
      <el-row :gutter="16">
        <!-- Question Type -->
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
      <el-form-item label="Images">
        <el-upload
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          :on-change="handleImageChange"
          :on-remove="handleImageRemove"
          multiple
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
            :placeholder="`Please input choice ${labelOf(index)}`"
            class="choice-input"
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

        <el-button type="success" plain :icon="Plus" @click="addChoice">
          Add Choice
        </el-button>
      </el-form-item>

      <!-- Correct Answer -->
      <el-form-item label="Correct Answer" prop="correctIndex">
        <el-select
          v-model="form.correctIndex"
          placeholder="Select"
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
// All comments in English

import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  UploadFilled,
  Plus,
  Delete as DeleteIcon,
} from "@element-plus/icons-vue";
import { create_question_api } from "@/apis/admin_api";



const router = useRouter();
const formRef = ref(null);

// Form model
const form = ref({
  name: "",
  type: "Multiple Choice",
  level: "",
  category: "",
  marks: null,
  question: "",
  images: [],
  choices: [{ text: "" }],
  correctIndex: [], // use array for multiple answers
});

// Validation rules
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

// Helpers
const labelOf = (i) => String.fromCharCode(65 + i);

// Add choice
function addChoice() {
  form.value.choices.push({ text: "" });
}

// Remove choice
function removeChoice(index) {
  if (form.value.choices.length === 1) return;
  form.value.choices.splice(index, 1);
  if (form.value.correctIndex !== null) {
    if (index === form.value.correctIndex) form.value.correctIndex = null;
    else if (index < form.value.correctIndex) form.value.correctIndex--;
  }
}

// Image upload handlers
function handleImageChange(file, fileList) {
  form.value.images = fileList.map((f) => f.raw);
}

function handleImageRemove(file, fileList) {
  form.value.images = fileList.map((f) => f.raw);
}

function submitForm() {
  formRef.value.validate(async (valid) => {
    if (!valid) return;

    try {
      const res = await create_question_api(form.value);
      console.log("✅ Saved:", res.data);
      router.push("/admin-home/question-bank");
    } catch (err) {
      console.error("❌ Save failed:", err);
    }
  });
}

// Reset form
function resetForm() {
  formRef.value.resetFields();
  form.value.choices = [{ text: "" }];
  form.value.correctIndex = null;
  form.value.images = [];
}

// Back navigation
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
