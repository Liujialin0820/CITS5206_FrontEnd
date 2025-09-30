<template>
  <el-dialog v-model="visible" title="Student Exam Attempts" width="700px">
    <el-table :data="attempts" border stripe>
      <el-table-column prop="paper.title" label="Paper" />
      <el-table-column prop="paper.level" label="Level" width="120" />
      <el-table-column prop="score" label="Score" width="100" />
      <el-table-column prop="total_marks" label="Total Marks" width="120" />
      <el-table-column prop="submitted_at" label="Submitted At" width="200" />
    </el-table>

    <template #footer>
      <el-button @click="visible = false">Close</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import { get_student_attempts_api } from "@/apis/students_api";

const visible = ref(false);
const attempts = ref([]);
const studentId = ref(null);
const currentLevel = ref("");

// 打开对话框并加载数据
async function open(id, level) {
  studentId.value = id;
  currentLevel.value = level;

  const data = await get_student_attempts_api(id);
  attempts.value = (data.attempts_detail || []).filter(
    (a) => a.paper.level === level
  );

  visible.value = true;
}

defineExpose({ open });
</script>
