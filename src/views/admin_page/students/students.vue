<template>
  <div class="students-page">
    <!-- Filters -->
    <div class="filters">
      <el-input
        v-model="search"
        placeholder="Search by name/email/student number"
        clearable
        class="search-box"
      />
      <el-button type="primary" @click="loadStudents">Search</el-button>
    </div>

    <!-- Table -->
    <el-table :data="students" stripe border>
      <el-table-column prop="student_no" label="Student Number" width="160" />
      <el-table-column prop="name" label="Name" min-width="160" />
      <el-table-column prop="email" label="E-mail" min-width="220" />
      <el-table-column
        prop="created_at"
        label="Registration Date"
        width="200"
      />

      <!-- Level 1-4 stats -->
      <el-table-column label="Exams (Attempts / Passed)">
        <template #default="{ row }">
          <div v-for="(stat, level) in row.attempts" :key="level">
            <el-link type="primary" @click="showAttempts(row.id, level)">
              {{ level }}: {{ stat.count }} /
              <span :style="{ color: stat.passed ? 'green' : 'red' }">
                {{ stat.passed ? "Yes" : "No" }}
              </span>
            </el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        v-model:current-page="page"
        @current-change="loadStudents"
      />
    </div>

    <!-- 子组件 -->
    <StudentAttemptsDialog ref="attemptDialogRef" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { get_students_api } from "@/apis/students_api";
import StudentAttemptsDialog from "./student_attempts_dialog.vue";

const page = ref(1);
const pageSize = 20;
const total = ref(0);
const search = ref("");
const students = ref([]);
const attemptDialogRef = ref(null);

async function loadStudents() {
  try {
    const params = {
      page: page.value,
      page_size: pageSize,
      search: search.value,
    };
    const data = await get_students_api(params);
    students.value = data.results || data;
    total.value = data.count || students.value.length;
  } catch (err) {
    console.error("❌ Failed to load students:", err);
  }
}

function showAttempts(studentId, level) {
  attemptDialogRef.value.open(studentId, level);
}

onMounted(() => {
  loadStudents();
});
</script>

<style scoped>
.students-page {
  padding: 20px;
}
.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}
.search-box {
  width: 300px;
}
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
