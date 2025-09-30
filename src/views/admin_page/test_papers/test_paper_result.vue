<template>
  <div class="paper-result">
    <h2>{{ result.paper_title }} - Results</h2>
    <p>Total Attempts: {{ result.attempts_count }}</p>

    <el-table :data="result.attempts" border stripe style="width: 100%">
      <el-table-column prop="student_no" label="Student Number" width="160" />
      <el-table-column prop="student_name" label="Name" min-width="160" />
      <el-table-column prop="score" label="Score" width="120" />
      <el-table-column prop="total_marks" label="Total Marks" width="140" />
      <el-table-column prop="submitted_at" label="Submitted At" width="200" />
    </el-table>

    <div class="actions">
      <el-button @click="goBack">← Back</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { get_test_paper_result_api } from "@/apis/test_paper_api";

const route = useRoute();
const router = useRouter();
const result = ref({ attempts: [] });

async function loadResult() {
  const data = await get_test_paper_result_api(route.params.id);
  result.value = data;
}

onMounted(loadResult);

function goBack() {
  router.back();
}
</script>

<style scoped>
.paper-result {
  padding: 20px;
}
.actions {
  margin-top: 20px;
}
</style>
