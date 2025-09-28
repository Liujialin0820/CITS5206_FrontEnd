<template>
  <div class="create-question">
    <h2>Create New Question</h2>

    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="120px"
      class="form-box"
    >
      <el-form-item label="Question ID" prop="id">
        <el-input v-model="form.id" placeholder="e.g. Q005" />
      </el-form-item>

      <el-form-item label="Question Name" prop="name">
        <el-input v-model="form.name" placeholder="e.g. Past Tense Verbs" />
      </el-form-item>

      <el-form-item label="Category" prop="category">
        <el-select v-model="form.category" placeholder="Select category">
          <el-option label="Vocabulary" value="Vocabulary" />
          <el-option label="Grammar" value="Grammar" />
        </el-select>
      </el-form-item>

      <el-form-item label="Type" prop="type">
        <el-select v-model="form.type" placeholder="Select type">
          <el-option label="Single Choice" value="Single Choice" />
          <el-option label="Multiple Choice" value="Multiple Choice" />
        </el-select>
      </el-form-item>

      <el-form-item label="Level" prop="level">
        <el-select v-model="form.level" placeholder="Select level">
          <el-option label="Level 1" value="Level 1" />
          <el-option label="Level 2" value="Level 2" />
          <el-option label="Level 3" value="Level 3" />
          <el-option label="Level 4" value="Level 4" />
        </el-select>
      </el-form-item>

      <el-form-item label="Description" prop="description">
        <el-input
          type="textarea"
          rows="4"
          v-model="form.description"
          placeholder="Enter question description"
        />
      </el-form-item>

      <!-- 操作按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">Save</el-button>
        <el-button @click="resetForm">Reset</el-button>
        <el-button type="info" @click="goBack">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const formRef = ref(null);

const form = ref({
  id: "",
  name: "",
  category: "",
  type: "",
  level: "",
  description: "",
});

const rules = {
  id: [{ required: true, message: "Please enter question ID", trigger: "blur" }],
  name: [{ required: true, message: "Please enter question name", trigger: "blur" }],
  category: [{ required: true, message: "Please select category", trigger: "change" }],
  type: [{ required: true, message: "Please select type", trigger: "change" }],
  level: [{ required: true, message: "Please select level", trigger: "change" }],
};

function submitForm() {
  formRef.value.validate((valid) => {
    if (valid) {
      console.log("✅ Question Created:", form.value);
      // TODO: 这里可以调用后端 API 保存题目
      router.push("/admin-home/question-bank");
    }
  });
}

function resetForm() {
  formRef.value.resetFields();
}

function goBack() {
  router.push("/admin-home/question-bank");
}
</script>

<style scoped>
.create-question {
  padding: 24px;
  max-width: 700px;
}

.form-box {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
</style>
