<template>
  <div class="students-page">
    <!-- Table -->
    <el-table :data="students" stripe border style="width: 100%">
      <el-table-column prop="id" label="student id" width="100" />
      <el-table-column prop="student_id" label="student code" width="140" />
      <el-table-column prop="name" label="name" min-width="180" />
      <el-table-column prop="email" label="e-mail" min-width="220" />
      <el-table-column prop="registration_date" label="registration date" width="200" />
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
  </div>
</template>

<script setup>
// All comments in English
import { ref, onMounted } from "vue";

// pagination state
const page = ref(1);
const pageSize = 6; // per page
const total = ref(30); // mock total count

// student list
const students = ref([]);

// mock data (normally fetch from backend API)
const allData = [
  { id: "00001", student_id: "S20231201", name: "Alice Zhang", email: "alice.zhang@student.edu.au", registration_date: "2025-02-14 10:32:45" },
  { id: "00002", student_id: "S20231187", name: "Ben Thompson", email: "ben.thompson@student.edu.au", registration_date: "2025-01-22 14:05:12" },
  { id: "00003", student_id: "S20231215", name: "Faisal Khan", email: "faisal.khan@student.edu.au", registration_date: "2025-03-03 09:48:30" },
  { id: "00004", student_id: "S20231098", name: "David Lee", email: "david.lee@student.edu.au", registration_date: "2025-02-28 16:20:18" },
  { id: "00005", student_id: "S20231145", name: "Emily Nguyen", email: "emily.nguyen@student.edu.au", registration_date: "2025-04-10 08:15:03" },
  { id: "00006", student_id: "S20231302", name: "Grace Lin", email: "grace.lin@student.edu.au", registration_date: "2025-05-01 12:50:55" },
  // 可以继续补更多 mock 数据
];

// load data by page
function loadStudents() {
  const start = (page.value - 1) * pageSize;
  const end = start + pageSize;
  students.value = allData.slice(start, end);
}

onMounted(() => {
  loadStudents();
});
</script>

<style scoped>
.students-page {
  padding: 20px;
}
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
