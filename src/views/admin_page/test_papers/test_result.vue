<template>
  <div class="test-result">
    <h2>Test Results</h2>
    <el-table :data="results" border stripe>
      <el-table-column prop="id" label="Student ID" width="120" />
      <el-table-column prop="name" label="Name" width="160" />
      <el-table-column prop="score" label="Score" width="100" />
      <el-table-column prop="status" label="Status" width="120" />
    </el-table>

    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        v-model:current-page="page"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const page = ref(1);
const pageSize = 10;
const total = ref(30);

const results = ref([
  { id: "S2023101", name: "Alice Zhang", score: 95, status: "Pass" },
  { id: "S2023102", name: "Ben Thompson", score: 78, status: "Pass" },
  { id: "S2023103", name: "Faisal Khan", score: 40, status: "Fail" },
]);
</script>

<style scoped>
.test-result { padding: 20px; }
.pagination { margin-top: 20px; display: flex; justify-content: center; }
</style>
